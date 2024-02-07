import React, { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Button, StructuredListSkeleton } from "@carbon/react";
import {
  formatDate,
  useLayoutType,
  useSession,
  age,
  parseDate,
  useConfig,
  usePatient,
} from "@openmrs/esm-framework";
import { usePatientSummary } from "../hooks/usePatientSummary";
import { Printer } from "@carbon/react/icons";
import { useReactToPrint } from "react-to-print";
import PrintComponent from "../print-layout/print.component";
import styles from "./patient-summary.scss";
import {
  CardHeader,
  EmptyState,
  ErrorState,
  useVisitOrOfflineVisit,
  useVitalsConceptMetadata,
  withUnit,
} from "@openmrs/esm-patient-common-lib";

interface PatientSummaryProps {
  patientUuid: string;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ patientUuid }) => {
  const { data, error, isLoading } = usePatientSummary(patientUuid);
  const currentUserSession = useSession();
  const componentRef = useRef(null);
  const [printMode, setPrintMode] = useState(false);

  const { t } = useTranslation();
  const isTablet = useLayoutType() == "tablet";

  const printRef = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => setPrintMode(true),
    onAfterPrint: () => setPrintMode(false),
    pageStyle: styles.pageStyle,
    documentTitle: data?.patientName,
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handlePrint = async () => {
    await delay(500);
    printRef();
  };

  // if (isLoading) {
  //   return <StructuredListSkeleton role="progressbar" />;
  // }

  // if (error) {
  //   return (
  //     <span>{t("errorPatientSummary", "Error loading patient summary")}</span>
  //   );
  // }

  // if (Object.keys(data)?.length === 0) {
  //   return;
  // }

  return (
    <div className={styles.bodyContainer} ref={componentRef}>
      {printMode === true && <PrintComponent />}
      <div className={styles.card}>
        <div
          className={isTablet ? styles.tabletHeading : styles.desktopHeading}
        >
          <h4 className={styles.title}>
            {" "}
            {t("patientSummary", "Patient summary")}
          </h4>
          {printMode === false && (
            <Button
              size="sm"
              className={styles.btnShow}
              onClick={() => {
                handlePrint(), setPrintMode(true);
              }}
              kind="tertiary"
              renderIcon={(props) => <Printer size={16} {...props} />}
              iconDescription={t("print", "Print")}
            >
              {t("print", "Print")}
            </Button>
          )}
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("reportDate", "Report date")}</p>
            <p>
              <span className={styles.value}>22.01.2024</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("clinicName", "Clinic name")}</p>
            <p>
              <span className={styles.value}>Juba Hospital</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("mflCode", "MFL code")}</p>
            <p>
              <span className={styles.value}>1243</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("uniquePatientIdentifier", "Unique patient identifier")}
            </p>
            <p>
              <span className={styles.value}>100037D</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("uniqueArtNumber", "Unique ART Number")}
            </p>
            <p>
              <span className={styles.value}>JWT/COS/00521</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("patientName", "Patient name")}</p>
            <p>
              <span className={styles.value}>User User User</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("birthDate", "Birth date")}</p>
            <p>
              <span className={styles.value}>12.08.2000</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("age", "Age")}</p>
            <p>
              <span className={styles.value}>20 Years</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("gender", "Gender")}</p>
            <p>
              <span className={styles.value}>Male</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("maritalStatus", "Marital status")}
            </p>
            <p>
              <span className={styles.value}>Single</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("dateConfirmedPositive", "Date confirmed HIV positive")}
            </p>
            <p>
              <span className={styles.value}>12.03.2023</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("firstCD4", "First CD4")}</p>
            <p>
              <span className={styles.value}>800</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("dateFirstCD4", "Date first CD4")}
            </p>
            <p>
              <span className={styles.value}>23.03.2023</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("weight", "Weight")}</p>
            <p>
              <span className={styles.value}>75kg</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("height", "Height")}</p>
            <p>
              <span className={styles.value}>127cm</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("bmi", "BMI")}</p>
            <p>
              <span className={styles.value}>46.4 (kg/m2)</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("drugAllergies", "Drug allergies")}
            </p>
            <p>
              <span className={styles.value}>
                {data?.allergies ? data?.allergies : "--"}
              </span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("clinicalNotes", "Clinical notes")}
            </p>
            <p>
              <span className={styles.value}>--</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("clinicianName", "Clinician name")}
            </p>
            <p>
              <span className={styles.value}>
                {currentUserSession?.user?.person?.display
                  ? currentUserSession?.user?.person?.display
                  : t("none", "None")}
              </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("clinicianSignature", "Clinician signature")}
            </p>
            <p>
              <span className={styles.value}>
                {currentUserSession?.user?.person?.display
                  ? currentUserSession?.user?.person?.display
                  : t("none", "None")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
