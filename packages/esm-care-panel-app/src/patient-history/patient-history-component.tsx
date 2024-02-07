import React from "react";
import styles from "./patient-history-component.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import {
  StructuredListSkeleton,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@carbon/react";
import RegimenButton from "../regimen-editor/regimen-button.component";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";
import VLStatus from "./vl-status-component";
import EligibilityForVL from "./eligibility-for-viral-load-table-component";

export interface PatientHistoryProps {
  patientUuid: string;
  programName: string;
}
const PatientHistoryComponent: React.FC<PatientHistoryProps> = ({
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
  const headers = [
    {
      key: "date",
      header: "Date",
    },
    {
      key: "lastvlresult",
      header: "Last VL Result",
    },
    {
      key: "vlstatus",
      header: "VL Status",
    },
  ];

  const rows = [
    {
      id: "a",
      date: "12/02/2024",
      lastvlresult: "800",
      vlstatus: "Suppressed",
    },
  ];

  return (
    <>
      <Tile>
        <div className={styles.card}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h4 className={styles.title}>
                {t("lastArvRefillDate", "Last ARV Refill Date")}
              </h4>
              <p>
                {" "}
                <span className={styles.value}>19/11/2023</span>
              </p>
            </div>
            <div className={styles.content}>
              <h4 className={styles.title}>
                {t("recentVisits", "Recent Visits")}
              </h4>
              <div className={styles.visitWrapper}>
                <div>
                  <p className={styles.visitContent}>19/11/2023</p>
                </div>
                <div>
                  <p className={styles.visitContent}>EAC</p>
                </div>
                <div>
                  <p className={styles.visitContent}>ART Card-Encounter</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <h4 className={styles.title}>
              {t("viralLoadHistory", "Viral Load History")}
            </h4>
            <VLStatus patientUuid={""} programName={""} />
            <EligibilityForVL patientUuid={""} programName={""} />
          </div>
        </div>
      </Tile>
    </>
  );
};
export default PatientHistoryComponent;
