import React from "react";
import styles from "./more-client-data-component.scss";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import { RegimenType } from "../types";
import Allergies from "./allergies-table-component";
import RedFlags from "./red-flags-table";
import IndexClientContacts from "./index-client-contacts-component";

export interface PatientHistoryProps {
  patientUuid: string;
  programName: string;
}
const MorePatientData: React.FC<PatientHistoryProps> = ({
  patientUuid,
  programName,
}) => {
  const { t } = useTranslation();

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
      <div className={styles.card}>
        <div className={styles.container}>
          <IndexClientContacts patientUuid={""} programName={""} />
          <Allergies patientUuid={""} programName={""} />
          <RedFlags patientUuid={""} programName={""} />
        </div>
      </div>
    </>
  );
};
export default MorePatientData;
