import React from "react";
import styles from "./more-client-data-component.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import { StructuredListSkeleton, Tile } from "@carbon/react";
import RegimenButton from "../regimen-editor/regimen-button.component";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
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
            <IndexClientContacts patientUuid={""} programName={""} />
          </div>
          <div className={styles.container}>
            <Allergies patientUuid={""} programName={""} />
            <RedFlags patientUuid={""} programName={""} />
          </div>
        </div>
      </Tile>
    </>
  );
};
export default MorePatientData;
