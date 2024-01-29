import React, { useEffect, useState } from "react";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import DashboardCard from "./dashboard-card/dashboard-card.component";
import { ExtensionSlot } from "@openmrs/esm-framework";
import {
  Home,
  UserFollow,
  UserAdmin,
  ArrowUp,
  EventSchedule,
  ChangeCatalog,
} from "@carbon/react/icons";
import { UnauthorizedUserAccess } from "@carbon/pictograms-react";
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  SkeletonPlaceholder,
} from "@carbon/react";
import EnrolledOnArtChart from "./charts/clients-newly-enrolled-on-art/clients-newly-enrolled-on-art.component";
import options from "./charts/options";
import chartData from "./charts/chartData";

type HomeDashboardProps = { customIconColor?: string };

interface HomeDashboardData {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  dashboardIcon: React.ReactNode;
  customIconColor: string;
  customBorderColor: string;
}

const DashboardPanel: React.FC<{ data: HomeDashboardData[] }> = ({ data }) => (
  <>
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
    <section style={{ marginTop: "5rem", width: "400px" }}>
      <EnrolledOnArtChart options={options} />
    </section>
  </>
);

const SkeletonPlaceholderComponent: React.FC = () => (
  <section className={styles.dashboardCard}>
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <SkeletonPlaceholder key={index} />
    ))}
  </section>
);

const HomeDashboard: React.FC<HomeDashboardProps> = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);

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
        count: 3,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: 3,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 2,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t("interruptedTreatments", "Interrupted Treatment"),
        count: 4,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
    ],
    "Children And Adolescent": [
      {
        label: t("newClients", "New Clients"),
        count: 6,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients"),
        count: 8,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("dueForViralLoad", "Due For Viral Load"),
        count: 2,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: 6,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 6,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t("interruptedTreatments", "Interrupted Treatment"),
        count: 2,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
    ],
    "Clients Returning From Interrupted treatment": [
      {
        label: t("newClients", "New Clients"),
        count: 7,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
          <ButtonSet style={{ gap: "20px" }}>
            {categories.map((category, index) => (
              <Button
                key={index}
                kind={index === activeCategory ? "primary" : "tertiary"}
                onClick={() => setActiveCategory(index)}
                style={{ width: "180px", padding: "5px" }}
              >
                {category}
              </Button>
            ))}
          </ButtonSet>
          {loading ? (
            <SkeletonPlaceholderComponent />
          ) : (
            <DashboardPanel data={dashboardData[categories[activeCategory]]} />
          )}
        </Column>
      </Grid>

      <section className="appointments">
        <ExtensionSlot name="hiv-art-dashboard-slot" />
      </section>
    </div>
  );
};

export default HomeDashboard;
