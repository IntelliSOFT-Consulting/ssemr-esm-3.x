import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { RegimenEncounter } from '../types';

export const useRegimenEncounter = (patientUuid: string, code: string) => {
  const regimenEncounterUrl = `/openmrs/ws/fhir2/R4/Observation?patient=${patientUuid}&code=${code}`;
  const { data, error } = useSWR(regimenEncounterUrl, openmrsFetch);

  const regimenEncounter = data?.value || null;
  return { regimenEncounter, error };
};
