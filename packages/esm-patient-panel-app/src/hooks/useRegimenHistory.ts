import { openmrsFetch } from "@openmrs/esm-framework";
import useSWR from "swr";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PatientRegimenReturnType {
  patientRegimen: RegimenHistory;
  isLoading: boolean;
  error: Error;
}

interface RegimenHistory {
  startDate: string;
  endDate: string;
  regimenShortDisplay: string;
  regimenLine: string;
  regimenLongDisplay: string;
  changeReasons: Array<string>;
  regimenUuid: string;
  current: boolean;
}

export const useRegimenHistory = (patientUuid: string, code: string) => {
  const regimenHistoryHistoryUrl = `/openmrs/ws/fhir2/R4/Observation?patientUuid=${patientUuid}&code=${code}`;
  const { data, error, isLoading } = useSWR<{
    data: { results: Array<RegimenHistory> };
  }>(regimenHistoryHistoryUrl, openmrsFetch);

  const regimen = data?.data?.results ? data?.data?.results : [];
  return { regimen, isLoading, error };
};
