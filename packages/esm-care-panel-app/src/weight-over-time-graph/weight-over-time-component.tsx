import React from "react";
import styles from "./weight-component.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import { AreaChart } from "@carbon/charts-react";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";
import data from "./data.js";
import options from "./options.js";

export interface PatientHistoryProps {
  patientUuid: string;
  programName: string;
}

const WeightTimeGragh: React.FC<PatientHistoryProps> = ({
  patientUuid,
  programName,
}) => {
  const {
    data: programData,
    isError,
    isLoading,
  } = useProgramSummary(patientUuid);
  const { t } = useTranslation();
  const { regimenEncounter } = useRegimenEncounter(
    RegimenType[programName],
    patientUuid
  );

  const state = {
    data: programData || data,
    options,
  };

  return (
    <>
      <Tile>
        <div className={styles.card}>
          <div className={styles.container}>
            <AreaChart data={state.data} options={state.options}></AreaChart>
          </div>
        </div>
      </Tile>
    </>
  );
};
export default WeightTimeGragh;
