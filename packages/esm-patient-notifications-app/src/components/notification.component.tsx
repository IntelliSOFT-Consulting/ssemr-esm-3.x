import React, { useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import useObservationData from "../hooks/useObservationData";
import styles from "./notification.scss";
import { Warning } from "@carbon/react/icons";

export interface NotificationsProps {
  patientUuid: string;
  code: string;
}

interface Notification {
  id: number;
  message: string;
  icon: React.ReactNode;
}

const Notifications: React.FC<NotificationsProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useObservationData(patientUuid);

  const notifications: Notification[] = useMemo(() => {
    if (!data || !data.results || !data.results.length) return [];

    const observation = data.results[0];
    if (!observation) return [];

    let idCounter = 1;
    const notificationsList: Notification[] = [];

    const observationRules = [
      {
        condition: (obs: any) => obs.cd4Done === null,
        message: "Perform a CD4 test for the patient.",
        icon: <Warning className={styles.mustardTag} />,
      },
      {
        condition: (obs: any) =>
          obs.vlResults && parseFloat(obs.vlResults) >= 1000,
        message:
          "Patient's viral load is Unsuppressed. Consider EAC and possible regimen change.",
        icon: <Warning className={styles.mustardTag} />,
      },
      {
        condition: (obs: any) => obs.tbStatus === "ND - TB Screening not done",
        message: "Perform a TB screening for the patient.",
        icon: <Warning className={styles.mustardTag} />,
      },
      {
        condition: (obs: any) => obs.tbStatus === "Pr TB - Presumptive TB",
        message: "Presumptive TB, test for Urine LAM / GeneXpert.",
        icon: <Warning className={styles.mustardTag} />,
      },
      {
        condition: (obs: any) =>
          obs.whoClinicalStage === "Stage 3" ||
          obs.whoClinicalStage === "Stage 4",
        message: "Risk of cryptococcal Meningitis, test for sCrAg.",
        icon: <Warning className={styles.mustardTag} />,
      },
    ];

    observationRules.forEach((rule) => {
      if (rule.condition(observation)) {
        notificationsList.push({
          id: idCounter++,
          message: rule.message,
          icon: rule.icon,
        });
      }
    });

    const indexFamilyMembers = observation.indexFamilyMembers;
    if (indexFamilyMembers && indexFamilyMembers.length > 0) {
      indexFamilyMembers.forEach((member: any) => {
        if (member.hivStatusKnown === "Unknown" && member.relationship) {
          if (member.relationship === "Child" && member.age < 15) {
            notificationsList.push({
              id: idCounter++,
              message:
                "Client has a Child with unknown HIV status, please test the child.",
              icon: <Warning className={styles.mustardTag} />,
            });
          } else if (member.relationship === "Sexual") {
            notificationsList.push({
              id: idCounter++,
              message:
                "Client has sexual partner with unknown HIV status, please test the contact.",
              icon: <Warning className={styles.mustardTag} />,
            });
          }
        }
      });
    }

    return notificationsList;
  }, [data]);

  const customStyles = {
    rows: {
      style: { minHeight: "72px", fontSize: "14px", fontWeight: "1000" },
    },
    cells: { style: { padding: "10px" } },
  };

  const columns: TableColumn<Notification>[] = [
    {
      name: "",
      selector: (row: Notification) => row.id.toString(),
      width: "50px",
    },
    { name: "", selector: (row: Notification) => row.message, wrap: true },
    { name: "", cell: (row: Notification) => row.icon, width: "50px" },
  ];

  if (error) {
    return <span>{t("errorPatientFlags", "Error loading patient flags")}</span>;
  }

  return (
    <div className={styles.datatable}>
      <DataTable
        columns={columns}
        data={notifications}
        customStyles={customStyles}
        noHeader
        striped
        progressPending={isLoading}
        progressComponent={
          <div className={styles.loading}>
            {t("loadingNotifications", "Loading notifications...")}
          </div>
        }
        noDataComponent={
          <div className={styles.emptyText}>
            {t("noNotifications", "No Notifications")}
          </div>
        }
      />
    </div>
  );
};

export default Notifications;
