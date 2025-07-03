import {
  FetchResponse,
  openmrsFetch,
  showSnackbar,
} from "@openmrs/esm-framework";
import useSWRImmutable from "swr/immutable";
import { ConceptAnswers, ConceptResponse } from "../patient-registration.types";
import dayjs from "dayjs";

interface Patient {
  name: string;
  uuid: string;
  patientId: number;
  sex: string;
  age: number;
  identifiers: PatientIdentifier[];
}

interface PatientIdentifier {
  identifier: string;
  identifierType: string;
}

interface PatientResponse {
  results: Patient[];
}

export function useConcept(conceptUuid: string): {
  data: ConceptResponse;
  isLoading: boolean;
} {
  const shouldFetch = typeof conceptUuid === "string" && conceptUuid !== "";
  const { data, error, isLoading } = useSWRImmutable<
    FetchResponse<ConceptResponse>,
    Error
  >(shouldFetch ? `/ws/rest/v1/concept/${conceptUuid}` : null, openmrsFetch);
  if (error) {
    showSnackbar({
      title: error.name,
      subtitle: error.message,
      kind: "error",
    });
  }
  return { data: data?.data, isLoading };
}

export function useConceptAnswers(conceptUuid: string): {
  data: Array<ConceptAnswers>;
  isLoading: boolean;
} {
  const shouldFetch = typeof conceptUuid === "string" && conceptUuid !== "";
  const { data, error, isLoading } = useSWRImmutable<
    FetchResponse<ConceptResponse>,
    Error
  >(shouldFetch ? `/ws/rest/v1/concept/${conceptUuid}` : null, openmrsFetch);
  if (error) {
    showSnackbar({
      title: error.name,
      subtitle: error.message,
      kind: "error",
    });
  }
  return { data: data?.data?.answers, isLoading };
}

// Fetching filtered patients based on facilities
export function useGetFilteredPatients(
  facilities: string,
  startDate: Date = dayjs().startOf("year").toDate(),
  endDate: Date = dayjs().endOf("day").toDate()
): {
  data: Patient[];
  isLoading: boolean;
} {
  const shouldFetch = typeof facilities === "string" && facilities !== "";
  const { data, error, isLoading } = useSWRImmutable<
    FetchResponse<PatientResponse>,
    Error
  >(
    shouldFetch
      ? `/ws/rest/v1/ssemr/dashboard/filteredPatientsList?startDate=${startDate}&endDate=${endDate}`
      : null,
    openmrsFetch
  );
  if (error) {
    showSnackbar({
      title: error.name,
      subtitle: error.message,
      kind: "error",
    });
  }
  return { data: data?.data.results, isLoading };
}
