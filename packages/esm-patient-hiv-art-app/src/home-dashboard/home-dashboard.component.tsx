import React from "react";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import DashboardCard from "./dashboard-card/dashboard-card.component";
import { ExtensionSlot } from "@openmrs/esm-framework";
import {
  UserMultiple,
  UserFollow,
  UserAdmin,
  Home,
  ArrowUp,
  EventSchedule,
  ChangeCatalog,
  WatsonHealthAiResultsVeryHigh,
} from "@carbon/react/icons";
import { UnauthorizedUserAccess } from "@carbon/pictograms-react";
import {
  Grid,
  Column,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@carbon/react";

type HomeDashboardProps = { customIconColor?: string };

interface DashboardData {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  dashboardIcon: React.ReactNode;
  customIconColor: string;
  customBorderColor: string;
}

const DashboardPanel: React.FC<{ data: DashboardData[] }> = ({ data }) => (
  <section className={styles.dashboardCard}>
    {data.map((item, index) => (
      <DashboardCard
        key={index}
        label={item.label}
        count={item.count}
        dashboardIcon={item.icon}
        customIconColor={item.color}
        customBorderColor={item.color}
      />
    ))}
  </section>
);

const HomeDashboard: React.FC<HomeDashboardProps> = (customIconColor) => {
  const { t } = useTranslation();

  const state = {};

  const dashboardData = {
    "Pregnant And Breastfeeding Women": [
      {
        label: t("newClients", "New Clients"),
        count: 12,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients"),
        count: 10,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("dueForViralLoad", "Due For Viral Load"),
        count: 31,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: 22,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 42,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t("interruptedTreatments", "Interrupted Treatment"),
        count: 23,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
    ],
    "Children And Adolescent": [
      {
        label: t("newClients", "New Clients"),
        count: 43,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients"),
        count: 27,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("dueForViralLoad", "Due For Viral Load"),
        count: 27,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: 32,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 12,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t("interruptedTreatments", "Interrupted Treatment"),
        count: 37,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
    ],
    "Clients Returning From Interrupted treatment": [
      {
        label: t("newClients", "New Clients"),
        count: 12,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients"),
        count: 10,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("dueForViralLoad", "Due For Viral Load"),
        count: 31,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: 22,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 42,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t("interruptedTreatments", "Interrupted Treatment"),
        count: 23,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
    ],
  };

  const categories = Object.keys(dashboardData);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.header}>
        <Home className={styles.icon} />
        <div className={styles.titleContainer}>
          <p className={styles.title}>{t("home", "Home")}</p>
          <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
        </div>
      </section>
      <section
        style={{
          marginTop: "3rem",
          marginLeft: "3rem",
          marginBottom: "1rem",
          fontWeight: "bold",
        }}
      >
        <div className={styles.titleContainer}>
          <p className={styles.subTitle}>
            {t("subPopulations", "Sub Populations")}
          </p>
        </div>
      </section>
      <Grid condensed>
        <Column lg={16} md={8} sm={4}>
          <Tabs>
            <TabList aria-label="List of tabs" contained>
              {categories.map((category, index) => (
                <Tab
                  key={index}
                  style={{ marginRight: "20px", width: "10rem" }}
                >
                  {category}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {categories.map((category, index) => (
                <TabPanel key={index}>
                  <DashboardPanel data={dashboardData[category]} />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>

      <section className="appointments">
        <ExtensionSlot name="hiv-art-dashboard-slot" />
      </section>
    </div>
  );
};

export default HomeDashboard;
