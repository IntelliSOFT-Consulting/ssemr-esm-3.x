import React from "react";
import styles from "./program-summary.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import RegimenButton from "../regimen-editor/regimen-button.component";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";
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
            <div className={styles.content}>
              <p>{t("dateOfEnrollment", "Date of Enrollment")}</p>
              <p>
                {" "}
                <span className={styles.value}>20.01.2024</span>
              </p>
            </div>
            <div className={styles.content}>
              <p>{t("latestArvRegimen", "Latest ARV Regimen")}</p>
              <p className={styles.value}>
                1a = AZT/3TC+EFV
                <span>
                  <RegimenButton
                    patientUuid={patientUuid}
                    category={programName}
                    onRegimen={""}
                  />
                </span>
              </p>
            </div>
            <div className={styles.content}>
              <p>{t("lastCD4Count", "Last CD4 count")}</p>
              <p>
                <span className={styles.value}>400</span>
                {data?.HIV?.cd4PercentDate ? <span>23.01.2024</span> : ""}
              </p>
            </div>
            <div className={styles.content}>
              <p>{t("bmiMuac", "BMI/MUAC")}</p>
              <p>
                <span className={styles.value}>18.5 Normal weight</span>
              </p>
            </div>
          </div>
        </div>
      </Tile>
    </>
  );
};
export default ProgramSummary;
