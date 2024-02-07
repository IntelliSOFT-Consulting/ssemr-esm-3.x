import React from "react";
import styles from "./last-arv-visit-summary.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import RegimenButton from "../regimen-editor/regimen-button.component";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";
export interface lastArtVisitSummaryProps {
  patientUuid: string;
  programName: string;
}
const lastArtVisitSummary: React.FC<lastArtVisitSummaryProps> = ({
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
          <div className={styles.desktopHeading}>
            <h4 className={styles.title}>
              {t("lastArtVisitSummary", "LAST ART VISIT SUMMARY")}
            </h4>
          </div>
          <div className={styles.container}>
            <div className={styles.content}>
              <p>{t("lastTBStatus", "Last TB status")}</p>
              <p>
                {" "}
                <span className={styles.value}>No Signs</span>
              </p>
            </div>
            <div className={styles.content}>
              <p>{t("lastArvRegimenDose", "Last ARV Regimen Dose")}</p>
              <p>
                <span className={styles.value}>60</span>
              </p>
            </div>
            <div className={styles.content}>
              <p>{t("nextVisitDate", "Next Visit Date")}</p>
              <p>
                <span className={styles.value}>23.01.2024</span>
              </p>
            </div>
            <div className={styles.content}>
              <p>{t("whoHivClinicalStage", "WHO HIV Clinical Stage")}</p>
              <p>
                <span className={styles.value}>
                  {t("whoStage", "WHO STAGE")} II
                </span>
              </p>
            </div>
          </div>
        </div>
      </Tile>
    </>
  );
};
export default lastArtVisitSummary;
