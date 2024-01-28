import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./care-panel.scss";
import ProgramSummary from "../program-summary/program-summary.component";
import { CardHeader } from "@openmrs/esm-patient-common-lib";

interface CarePanelProps {
  patientUuid: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formEntrySub: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  launchPatientWorkspace: Function;
}

const CarePanel: React.FC<CarePanelProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.widgetCard}>
        <CardHeader
          title={t("patientSummary", "PATIENT SUMMARY")}
          children={""}
        ></CardHeader>
        <div style={{ width: "100%", minHeight: "20rem" }}>
          <ProgramSummary patientUuid={patientUuid} programName={""} />
        </div>
      </div>
    </>
  );
};

export default CarePanel;
