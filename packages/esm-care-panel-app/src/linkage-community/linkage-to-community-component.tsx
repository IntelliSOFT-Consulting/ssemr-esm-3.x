import React from "react";
import styles from "./linkage-to-community-component.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";
import LinkageToCHWTable from "./linkage-to-community-table";

export interface PatientHistoryProps {
  patientUuid: string;
  programName: string;
}
const LinkageToCHW: React.FC<PatientHistoryProps> = ({
  patientUuid,
  programName,
}) => {
  const { data, isError, isLoading } = useProgramSummary(patientUuid);
  const { t } = useTranslation();
  const { regimenEncounter } = useRegimenEncounter(
    RegimenType[programName],
    patientUuid
  );

  // const isTablet = useLayoutType() == "tablet";
  // if (isLoading) {
  //   return <StructuredListSkeleton role="progressbar" />;
  // }
  // if (isError) {
  //   return <span>{t("errorProgramSummary", "Error loading HIV summary")}</span>;
  // }
  // if (Object.keys(data ?? {})?.length === 0) {
  //   return;
  // }

  return (
    <>
      <Tile>
        <div className={styles.card}>
          <div className={styles.container}>
            <LinkageToCHWTable patientUuid={""} programName={""} />
          </div>
        </div>
      </Tile>
    </>
  );
};
export default LinkageToCHW;
