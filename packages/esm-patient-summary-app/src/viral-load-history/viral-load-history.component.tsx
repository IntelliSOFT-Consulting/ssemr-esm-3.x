import React from "react";
import styles from "./vl-summary.scss";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile, Tag } from "@carbon/react";
import useObservationData from "../hooks/useObservationData";
import { RegimenType } from "../types";
export interface ProgramSummaryProps {
  patientUuid: string;
  code: string;
}
const ViralLoadlHistory: React.FC<ProgramSummaryProps> = ({ patientUuid }) => {
  const { data, isLoading, error } = useObservationData(patientUuid);
  const { t } = useTranslation();

  const isTablet = useLayoutType() == "tablet";
  if (isLoading) {
    return (
      <Tile>
        <StructuredListSkeleton role="progressbar" />
      </Tile>
    );
  }

  if (error) {
    return (
      <span>{t("errorPatientSummary", "Error loading Patient summary")}</span>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const vlDate = data.results[0]?.dateVLResultsReceived;
  const vlResult = data.results[0]?.vlResults;
  const vlStatus =
    data.results[0]?.vlStatus === "Unknown" ? "---" : data.results[0]?.vlStatus;

  const vlEligibilityResult = data.results[0]?.vlEligibility;
  const dateVlSampleCollected = data.results[0]?.vlDueDate;

  return (
    <>
      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p>{t("lastArvRefillDate", "Last ARV Refill Date")}</p>
            <p>
              {" "}
              <span className={styles.value}>
                {data.results[0]?.lastRefillDate}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p>{t("dateVLRecieved", "Date Viral Load Results Received")}</p>
            <p>{vlDate}</p>
          </div>
          <div className={styles.content}>
            <p>{t("lastVLResult", "Last VL Result")}</p>
            <p className={styles.value}>{vlResult}</p>
          </div>
          <div className={styles.content}>
            <p>{t("vlStatus", "VL Status")}</p>
            <p>
              <span className={styles.value}>{vlStatus}</span>
            </p>
          </div>
        </div>
      </div>
      <hr style={{ margin: "20px" }} />
      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p>
              {t(
                "eligibilityForVL",
                "Eligibility For Viral Load Sample Collection"
              )}
            </p>
            <Tag type={vlEligibilityResult === "Eligible" ? "magenta" : "green"}>
              {vlEligibilityResult}
            </Tag>
          </div>
          <div className={styles.content}></div>
          {vlEligibilityResult === "Eligible" && (
            <div className={styles.content}>
              <p>{t("date", "Date")}</p>
              <span className={styles.value}>
                  {(data.results[0]?.vlDueDate)}
                </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ViralLoadlHistory;
