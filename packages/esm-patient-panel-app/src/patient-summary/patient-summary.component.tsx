import React, { useRef, useState } from "react";
import styles from "./patient-summary.scss";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType, useSession } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Button } from "@carbon/react";
import { usePatientSummary } from "../hooks/usePatientSummary";
import { Printer } from "@carbon/react/icons";
import { useReactToPrint } from "react-to-print";
import PrintComponent from "../print-layout/print.component";

interface PatientSummaryProps {
  patientUuid: string;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ patientUuid }) => {
  const { data, isError, isLoading } = usePatientSummary(patientUuid);
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

  if (isLoading) {
    return <StructuredListSkeleton role="progressbar" />;
  }

  if (isError) {
    return (
      <span>{t("errorPatientSummary", "Error loading patient summary")}</span>
    );
  }

  if (Object.keys(data)?.length === 0) {
    return;
  }

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
              <span className={styles.value}>22.02.2024</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("clinicName", "Clinic name")}</p>
            <p>
              <span className={styles.value}>Juba Referral</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("uniquePatientIdentifier", "Unique patient identifier")}
            </p>
            <p>
              <span className={styles.value}>JSC/01123</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("patientName", "Patient name")}</p>
            <p>
              <span className={styles.value}>Patient Name</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("birthDate", "Birth date")}</p>
            <p>
              <span className={styles.value}>23/09/1999</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("age", "Age")}</p>
            <p>
              <span className={styles.value}>23</span>
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
              <span className={styles.value}>24.09.2022</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("firstCD4", "First CD4")}</p>
            <p>
              <span className={styles.value}>1200</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("dateFirstCD4", "Date first CD4")}
            </p>
            <p>
              <span className={styles.value}>23.01.2023</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("dateEnrolledToCare", "Date enrolled into care")}
            </p>
            <p>
              <span className={styles.value}>23.08.2023</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("whoAtEnrollment", "WHO stage at enrollment")}
            </p>
            <p>
              <span className={styles.value}>WHO Stage 1</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("transferInDate", "Transfer in date")}
            </p>
            <p>
              <span className={styles.value}>23.05.2023</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("entryPoint", "Entry point")}</p>
            <p>
              <span className={styles.value}>TB</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("dateOfEntryPoint", "Date of entry point")}
            </p>
            <p>
              <span className={styles.value}>23.09.2024</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("facilityTransferredFrom", "Facility transferred from")}
            </p>
            <p>
              <span className={styles.value}>JUBA Hospital</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("weight", "Weight")}</p>
            <p>
              <span className={styles.value}>75</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("height", "Height")}</p>
            <p>
              <span className={styles.value}>127</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("bmi", "BMI")}</p>
            <p>
              <span className={styles.value}>34.7</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("bloodPressure", "Blood pressure")}
            </p>
            <p>
              <span className={styles.value}>60/72</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("oxygenSaturation", "Oxygen saturation")}
            </p>
            <p>
              <span className={styles.value}>700</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("respiratoryRate", "Respiratory rate")}
            </p>
            <p>
              <span className={styles.value}>60/60</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("pulseRate", "Pulse rate")}</p>
            <p>
              <span className={styles.value}>43</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("familyProtection", "FP method")}</p>
            <p>
              <span className={styles.value}>N/A</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("tbScreeningOutcome", "TB screening outcome")}
            </p>
            <p>
              <span className={styles.value}>TB Affected</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("treatmentSupporterName", "Treatment supporter name")}
            </p>
            <p>
              <span className={styles.value}>Test Name</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t(
                "treatmentSupporterRelationship",
                "Treatment supporter relationship"
              )}
            </p>
            <p>
              <span className={styles.value}>
                Test treatmentSupporterRelationship
              </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("treatmentSupporterContact", "Treatment Supporter contact")}
            </p>
            <p>
              <span className={styles.value}>+255 723454321</span>
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
              <span className={styles.value}>Dust</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("previousART", "Previous ART")}</p>
            <p>
              <span className={styles.value}>N/A</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("dateStartedART", "Date started ART")}
            </p>
            <p>
              <span className={styles.value}>N/A</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("clinicalStageART", "Clinical stage at ART")}
            </p>
            <p>
              <span className={styles.value}>N/A</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("initialRegimen", "Initial regimen")}
            </p>
            <p>
              <span className={styles.value}>1a = AZT/3TC+EFV</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("initialRegimenDate", "Initial regimen date")}
            </p>
            <p>
              <span className={styles.value}>02.10.2023</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("currentArtRegimen", "Current Art regimen")}
            </p>
            <p>
              <span className={styles.value}>1a = AZT/3TC+EFV</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("currentArtRegimenDate", "Current Art regimen date")}
            </p>
            <p>
              <span className={styles.value}>20.01.2024</span>
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("artInterruptionReason", "ART interruptions reason")}
            </p>
            <p>
              <span className={styles.value}>--</span>
              <span className={styles.label}> </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t(
                "substitutionWithin1stLineRegimen",
                "Substitution within 1st line regimen"
              )}
            </p>
            <p>
              <span className={styles.value}>--</span>
              <span className={styles.label}> </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("switchTo2ndLineRegimen", "Switch to 2nd line regimen")}
            </p>
            <p>
              <span className={styles.value}>--</span>
              <span className={styles.label}> </span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>{t("Dapsone", "Dapsone")}</p>
            <p>
              <span className={styles.value}>--</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("tpt", "TPT")}</p>
            <p>
              <span className={styles.value}>--</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("clinicsEnrolled", "Clinics enrolled")}
            </p>
            <p>
              <span className={styles.value}>--</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("transferOutDate", "Transfer out date")}
            </p>
            <p>
              <span className={styles.value}>
                {data?.transferOutDate === "N/A" ||
                data?.transferOutDate === "" ? (
                  <span>None</span>
                ) : (
                  <span>--</span>
                )}
              </span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("transferOutFacility", "Transfer out facility")}
            </p>
            <p>
              <span className={styles.value}>--</span>
            </p>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("deathDate", "Death date")}</p>
            <p>
              <span className={styles.value}>--</span>
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.label}>
              {t("viralLoadTrends", "Viral load trends")}
            </p>
            {data?.allVlResults?.value?.length > 0
              ? data?.allVlResults?.value?.map((vl) => {
                  return (
                    <>
                      <span className={styles.value}> {vl.vl} </span>
                      {vl?.vlDate === "N/A" || vl?.vlDate === "" ? (
                        <span>None</span>
                      ) : (
                        <span>{vl.vlDate}</span>
                      )}
                      <br />
                    </>
                  );
                })
              : "--"}
          </div>
          <div className={styles.content}>
            <p className={styles.label}>{t("cd4Trends", "CD4 Trends")}</p>
            {data?.allCd4CountResults?.length > 0
              ? data?.allCd4CountResults?.map((cd4) => {
                  return (
                    <>
                      <span className={styles.value}> {cd4.cd4Count} </span>
                      <span className={styles.label}> </span>
                      <br />
                    </>
                  );
                })
              : "--"}
          </div>
        </div>

        <hr />
      </div>
    </div>
  );
};

export default PatientSummary;
