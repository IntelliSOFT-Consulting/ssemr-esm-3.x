import dayjs from 'dayjs';
import useSWR from 'swr';
import {
  getDynamicOfflineDataEntries,
  interpolateUrl,
  openmrsFetch,
  restBaseUrl,
  useConfig,
  userHasAccess,
  useSession,
} from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import type { ListResponse, Form, EncounterWithFormRef, CompletedFormInfo } from '../types';
import { customEncounterRepresentation, customFormRepresentation, formEncounterUrl, formEncounterUrlPoc } from '../constants';
import { isValidOfflineFormEncounter } from '../offline-forms/offline-form-helpers';
import axios from 'axios';

function useCustomFormsUrl(patientUuid: string, visitUuid: string) {
  const { customFormsUrl, showHtmlFormEntryForms } = useConfig<ConfigObject>();
  const hasCustomFormsUrl = Boolean(customFormsUrl);

  const baseUrl = hasCustomFormsUrl ? customFormsUrl : showHtmlFormEntryForms ? formEncounterUrl : formEncounterUrlPoc;

  const url = interpolateUrl(baseUrl, {
    patientUuid: patientUuid,
    visitUuid: visitUuid,
    representation: customFormRepresentation,
  });

  return {
    url,
    hasCustomFormsUrl,
  };
}

export function useFormEncounters(cachedOfflineFormsOnly = false, patientUuid: string = '', visitUuid: string = '') {
  const { url, hasCustomFormsUrl } = useCustomFormsUrl(patientUuid, visitUuid);

  return useSWR([url, cachedOfflineFormsOnly], async () => {
    const res = await openmrsFetch<ListResponse<Form>>(url);
    // show published forms and hide component forms
    const forms = hasCustomFormsUrl
      ? res?.data.results
      : res.data?.results?.filter((form) => form.published && !/component/i.test(form.name)) ?? [];

    if (!cachedOfflineFormsOnly) {
      return forms;
    }

    const dynamicFormData = await getDynamicOfflineDataEntries('form');
    return forms.filter((form) => dynamicFormData.some((entry) => entry.identifier === form.uuid));
  });
}

export function useEncountersWithFormRef(
  patientUuid: string,
  startDate: Date = dayjs(new Date()).startOf('day').subtract(500, 'day').toDate(),
  endDate: Date = dayjs(new Date()).endOf('day').toDate(),
) {
  const url = patientUuid
    ? `${restBaseUrl}/encounter?v=${customEncounterRepresentation}&patient=${patientUuid}&fromdate=${startDate.toISOString()}&todate=${endDate.toISOString()}`
    : null;
  return useSWR(url, openmrsFetch<ListResponse<EncounterWithFormRef>>);
}

// December 31, 1969; hopefully we don't have encounters before that
const MINIMUM_DATE = new Date(0);

interface ExternalFormResponse {
  results: Array<{
    id: number;
    uuid: string;
    display: string;
    description: string;
    encounterType: {
      uuid: string;
      name: string;
    };
    lastFilledDate: string;
  }>;
  latestVisitDate: string;
}

// Create a SWR-compatible fetcher wrapper for `openmrsFetch`
const swrFetcher = async <T>(url: string): Promise<T> => {
  const response = await openmrsFetch<T>(url);
  return response.data;
};

export function useForms(
  patientUuid: string,
  visitUuid?: string,
  startDate?: Date,
  endDate?: Date,
  cachedOfflineFormsOnly = false,
  orderBy: 'name' | 'most-recent' = 'name',
) {
  const { htmlFormEntryForms } = useConfig<ConfigObject>();
  const allFormsRes = useFormEncounters(cachedOfflineFormsOnly, patientUuid, visitUuid);
  const encountersRes = useEncountersWithFormRef(patientUuid, startDate, endDate);
  const pastEncounters = encountersRes.data?.data?.results ?? [];
  const data = allFormsRes.data ? mapToFormCompletedInfo(allFormsRes.data, pastEncounters) : undefined;
  const session = useSession();

  // Fetch the external forms list from the API
  const externalFormsApiUrl = `${restBaseUrl}/ssemr/forms?patientUuid=${patientUuid}`;
  const externalFormsRes = useSWR<ExternalFormResponse>(externalFormsApiUrl, swrFetcher);

  const externalFormUuids = externalFormsRes.data?.results?.map((form) => form.uuid) || [];

  const mutateForms = () => {
    allFormsRes.mutate();
    encountersRes.mutate();
    externalFormsRes.mutate();
  };
  // Note:
  // `pastEncounters` is currently considered as optional (i.e. any errors are ignored) since it's only used for display
  // and doesn't change any functional flows. This makes offline mode much easier to implement since the past encounters
  // don't have to be cached regularly.
  // If this ever becomes a problem for online mode (i.e. if an error should be rendered there when past encounters
  // for determining filled out forms can't be loaded) this should ideally be conditionally controlled via a flag
  // such that the current offline behavior doesn't change.
  let formsToDisplay = cachedOfflineFormsOnly
    ? data?.filter((formInfo) => isValidOfflineFormEncounter(formInfo.form, htmlFormEntryForms))
    : data;

  // Filter out forms that are not in the external API's UUID list
  formsToDisplay = formsToDisplay?.filter((formInfo) => externalFormUuids.includes(formInfo.form.uuid));

  if (session?.user) {
    formsToDisplay = formsToDisplay?.filter((formInfo) =>
      userHasAccess(formInfo?.form?.encounterType?.editPrivilege?.display, session.user),
    );
  }

  if (orderBy === 'name') {
    formsToDisplay?.sort((formInfo1, formInfo2) =>
      (formInfo1.form.display ?? formInfo1.form.name).localeCompare(formInfo2.form.display ?? formInfo2.form.name),
    );
  } else {
    formsToDisplay?.sort(
      (formInfo1, formInfo2) =>
        (formInfo1.lastCompletedDate ?? MINIMUM_DATE).getDate() -
        (formInfo2.lastCompletedDate ?? MINIMUM_DATE).getDate(),
    );
  }

  return {
    data: formsToDisplay,
    error: allFormsRes.error,
    isValidating: allFormsRes.isValidating || encountersRes.isValidating,
    allForms: allFormsRes.data,
    mutateForms,
  };
}

function mapToFormCompletedInfo(
  allForms: Array<Form>,
  encounters: Array<EncounterWithFormRef>,
): Array<CompletedFormInfo> {
  return allForms.map((form) => {
    const associatedEncounters = encounters.filter((encounter) => encounter.form?.uuid === form?.uuid);
    const lastCompletedDate =
      associatedEncounters.length > 0
        ? new Date(Math.max(...associatedEncounters.map((e) => new Date(e.encounterDatetime).getTime())))
        : undefined;

    return {
      form,
      associatedEncounters,
      lastCompletedDate,
    };
  });
}


export async function useVisitTime(patientUuid: string) {
  const externalFormsApiUrl = `${restBaseUrl}/ssemr/forms?patientUuid=${patientUuid}`;
  const data = await openmrsFetch<ExternalFormResponse>(externalFormsApiUrl);

  const latestVisit = data.data?.latestVisitDate;

  return latestVisit;
}