import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StructuredListSkeleton, ContentSwitcher, Switch } from "@carbon/react";
import styles from "./weight-panel.scss";
import { useEnrollmentHistory } from "../hooks/useEnrollmentHistory";
import { CardHeader, EmptyState } from "@openmrs/esm-patient-common-lib";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import { ErrorState } from "@openmrs/esm-framework";
import WeightTimeGragh from "../weight-over-time-graph/weight-over-time-component";

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

const WeightGraph: React.FC<PatientHistoryProps> = ({
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

  return (
    <>
      <div className={styles.widgetCard}>
        <CardHeader title={t("weightMonitoring", "Weight Monitoring")}>
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
          <WeightTimeGragh patientUuid={""} programName={""} />
        </div>
      </div>
    </>
  );
};

export default WeightGraph;
