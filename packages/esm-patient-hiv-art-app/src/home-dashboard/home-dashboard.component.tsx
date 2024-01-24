import React from "react";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import DashboardCard from "./dashboard-card/dashboard-card.component";
import { ExtensionSlot } from "@openmrs/esm-framework";
import {
  UserMultiple,
  UserActivity,
  EventSchedule,
  ChangeCatalog,
  WatsonHealthAiResultsVeryHigh,
} from "@carbon/react/icons";

type HomeDashboardProps = {
  
};

const HomeDashboard: React.FC<HomeDashboardProps> = () => {
  const { t } = useTranslation();

  const state = {};
  return (
    <div className={styles.homeContainer}>
      <section className={styles.header}>
        <p className={styles.title}>{t("hivAndCareTitle", "HIV Care & ART")}</p>
        <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
      </section>
      <section className={styles.dashboardCard}>
        <DashboardCard
          label={t("newClients", "New Clients")}
          count={12}
          dashboardIcon={<UserMultiple size={48} />}
        />
        <DashboardCard
          label={t("activeClients", "Active Clients")}
          count={23}
          dashboardIcon={<UserActivity size={48} />}
        />
        <DashboardCard
          label={t("dueForViralLoad", "Due for Viral Load")}
          count={42}
          dashboardIcon={<EventSchedule size={48} />}
        />
        <DashboardCard
          label={t("hivViralLoad", "High Viral Load")}
          count={22}
          dashboardIcon={<WatsonHealthAiResultsVeryHigh size={48} />}
        />
        <DashboardCard
          label={t("missedAppointments", "Missed appointments")}
          count={42}
          dashboardIcon={<EventSchedule size={48} />}
        />
        <DashboardCard
          label={t("interuptedTreatments", "Interupted Treatment")}
          count={23}
          dashboardIcon={<ChangeCatalog size={48} />}
        />
      </section>
    </div>
  );
};

export default HomeDashboard;
