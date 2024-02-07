import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StructuredListSkeleton, ContentSwitcher, Switch } from "@carbon/react";
import styles from "./linkage-to-chw-panel.scss";
import { useEnrollmentHistory } from "../hooks/useEnrollmentHistory";
import { CardHeader, EmptyState } from "@openmrs/esm-patient-common-lib";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import { ErrorState } from "@openmrs/esm-framework";
import LinkageToCHW from "../linkage-community/linkage-to-community-component";

interface PatientHistoryProps {
  patientUuid: string;
  formEntrySub: any;
  launchPatientWorkspace: Function;
}

type SwitcherItem = {
  index: number;
  name?: string;
  text?: string;
};

const LinkageToCommunityHealthWorker: React.FC<PatientHistoryProps> = ({
  patientUuid,
  formEntrySub,
  launchPatientWorkspace,
}) => {
  const { t } = useTranslation();
  const { isLoading, error, enrollments } = useEnrollmentHistory(patientUuid);
  const switcherHeaders = sortBy(Object.keys(enrollments || {}));
  const [switchItem, setSwitcherItem] = useState<SwitcherItem>({ index: 0 });
  const patientEnrollments = useMemo(
    () =>
      isLoading ? [] : enrollments[switchItem?.name || first(switcherHeaders)],
    [enrollments, isLoading, switchItem?.name, switcherHeaders]
  );

  // if (isLoading) {
  //   return (
  //     <div className={styles.widgetCard}>
  //       <StructuredListSkeleton role="progressbar" />
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <ErrorState
  //       error={error}
  //       headerTitle={t("errorSummary", "Error summary")}
  //     />
  //   );
  // }

  // if (Object.keys(enrollments).length === 0) {
  //   return (
  //     <>
  //       <EmptyState
  //         displayText={t("patientSummary", "patient summary")}
  //         headerTitle={t("patientSummary", "Patient summary")}
  //       />
  //       <div className={styles.careProgramContainer}>
  //         <CarePrograms patientUuid={patientUuid} />
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className={styles.widgetCard}>
        <CardHeader
          title={t(
            "linkageToCommunityProgramme",
            "Linkage To Community Programme"
          )}
        >
          <div className={styles.contextSwitcherContainer}>
            <ContentSwitcher
              selectedIndex={switchItem?.index}
              onChange={setSwitcherItem}
            >
              {switcherHeaders?.map((enrollment) => (
                <Switch key={enrollment} name={enrollment} text={enrollment} />
              ))}
            </ContentSwitcher>
          </div>
        </CardHeader>
        <div style={{ width: "100%", minHeight: "20rem" }}>
          <LinkageToCHW patientUuid={""} programName={""} />
        </div>
      </div>
    </>
  );
};

export default LinkageToCommunityHealthWorker;
