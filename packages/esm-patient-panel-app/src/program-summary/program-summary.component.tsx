import React from "react";
import styles from "./program-summary.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import { ProgramType, RegimenType } from "../types";
import RegimenButton from "../regimen-editor/regimen-button.component";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
export interface ProgramSummaryProps {
  patientUuid: string;
  programName: string;
}
const ProgramSummary: React.FC<ProgramSummaryProps> = ({
  patientUuid,
  programName,
}) => {
  const { data, isError, isLoading } = useProgramSummary(patientUuid);
  const { t } = useTranslation();
  const { regimenEncounter } = useRegimenEncounter(
    RegimenType[programName],
    patientUuid
  );

  return (
    <>
      <div className={styles.card}>
        <div
          className={isTablet ? styles.tabletHeading : styles.desktopHeading}
        >
          <h4 className={styles.title}>
            {" "}
            {t("currentStatus", "Current status")}
          </h4>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p>{t("lastCd4Count", "Last CD4 count")}</p>
            <p>
              <span className={styles.value}>1200</span>
              <span> 23.01.2024 </span>
            </p>
          </div>
          <div className={styles.content}>
            <p>{t("lastViralLoad", "Last viral load")}</p>
            <p>
              {" "}
              <span className={styles.value}>LDL</span>
              <span> 23.01.2024 </span>
            </p>
          </div>
          <div className={styles.content}>
            <p>{t("CD4Percentage", "CD4 percentage")}</p>
            <p>
              <span className={styles.value}>34</span>
              <span> 23.01.2024 </span>
            </p>
          </div>
          <div className={styles.content}>
            <p>{t("lastWhoStage", "Last WHO stage")}</p>
            <p>
              <span className={styles.value}>Stage 1</span>
              <span> 23.01.2024 </span>
            </p>
          </div>
          <div className={styles.content}>
            <p>{t("regimen", "Regimen")}</p>
            <span className={styles.value}>1a = AZT/3TC+EFV</span>
            <span> Edit Regimen </span>
          </div>
          <div className={styles.content}>
            <p>{t("regimenStartDate", " Date started regimen")}</p>
            <span className={styles.value}>23.01.2023</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProgramSummary;
