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
import { useDashboardData } from "../hooks/fetchAggrigateData";

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

  const { loading: newlyEnrolledLoad, count: newlyEnrolledClients } =
    useDashboardData(
      "newClients",
      "newlyEnrolledClients",
      "Newly Enrolled Clients"
    );
  console.log("Count for newlyEnrolledClients:", newlyEnrolledClients);

  const { loading: childrenLoad, count: childrenAndAdolescentCount } =
    useDashboardData("newClients", "newClients", "New Clients", "1-19");

  const { loading: activeClientsLoad, count: activeClientsCount } =
    useDashboardData(
      "activeClients",
      "activeClients",
      "Active Clients (TX_CURR)"
    );

  const {
    loading: LoadActiveChildren,
    count: activeChildrenAndAdolescentCount,
  } = useDashboardData(
    "activeClients",
    "activeClients",
    "Active Clients",
    "1-19"
  );

  const { loading: missedAppointmentsLoad, count: missedAppointment } =
    useDashboardData(
      "missedAppointments",
      "missedAppointments",
      "Missed appointments"
    );

  const {
    loading: LoadChildrenMissedAppointments,
    count: childrenAndAdolescentCMissedAppointmentsount,
  } = useDashboardData(
    "missedAppointments",
    "missedAppointments",
    "Missed appointments",
    "1-19"
  );

  const { loading: interruptedTreatmentLoad, count: interruptedTreatment } =
    useDashboardData(
      "interruptionsInTreatments",
      "interruptionsInTreatments",
      "Interruptions In Treatment (lit)"
    );

  const {
    loading: LoadChildrenInterruptionInTreatment,
    count: childrenAndAdolescentInterruptionInTreatmentCount,
  } = useDashboardData(
    "interruptionsInTreatments",
    "interruptionsInTreatments",
    "Interruptions In Treatment (lit)",
    "1-19"
  );

  const { loading: dueForViralLoadLoad, count: dueForViralLoad } =
    useDashboardData("dueForVl", "dueForVl", "Due For Viral Load");

  const {
    loading: childrenDueForViralLoad,
    count: childrenAndAdolescentDueForViralLoadCount,
  } = useDashboardData(
    "activeClients",
    "activeClients",
    "Active Clients",
    "1-19"
  );

  const { loading: highViralLoadLoad, count: highViralLoad } = useDashboardData(
    "highVl",
    "highVl",
    "High Viral Load"
  );

  const {
    loading: childrenHighViralLoad,
    count: childrenAndAdolescentHighViralLoadCount,
  } = useDashboardData(
    "activeClients",
    "activeClients",
    "Active Clients",
    "1-19"
  );

  const dashboardData = {
    "All Clients": [
      {
        label: t("newlyEnrolledClients", "Newly Enrolled Clients"),
        count: newlyEnrolledClients || 0,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients (TX_CURR)"),
        count: activeClientsCount || 0,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("onAppointment", "On Appointment"),
        count: 3,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: missedAppointment || 0,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t(
          "interruptionsInTreatments",
          "Interruptions In Treatment (lit)"
        ),
        count: interruptedTreatment || 0,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
      {
        label: t("returnedToTreatment", "Returned To Treatment (TX_Rtt)"),
        count: 12,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
      {
        label: t("dueForViralLoad", "Due For Viral Load"),
        count: dueForViralLoad || 0,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: highViralLoad || 0,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
    ],
    "Children And Adolescent": [
      {
        label: t("newClients", "Newly Enrolled Clients"),
        count: childrenAndAdolescentCount || 0,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients (TX_CURR)"),
        count: activeChildrenAndAdolescentCount || 0,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("onAppointment", "On Appointment"),
        count: 3,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: childrenAndAdolescentCMissedAppointmentsount || 0,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t(
          "interruptionsInTreatments",
          "Interruptions In Treatment (lit)"
        ),
        count: childrenAndAdolescentInterruptionInTreatmentCount || 0,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
      {
        label: t("returnedToTreatment", "Returned To Treatment (TX_Rtt)"),
        count: 4,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
      {
        label: t("dueForViralLoad", "Due For Viral Load"),
        count: childrenAndAdolescentDueForViralLoadCount || 0,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("hivViralLoad", "High Viral Load"),
        count: childrenAndAdolescentHighViralLoadCount || 0,
        icon: <ArrowUp size={48} />,
        color: "#B20707",
      },
    ],
    "Clients Returning From Interrupted treatment": [
      {
        label: t("newClients", "Newly Enrolled Clients"),
        count: 0,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients (TX_CURR)"),
        count: 0,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("onAppointment", "On Appointment"),
        count: 3,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 0,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t(
          "interruptionsInTreatments",
          "Interruptions In Treatment (lit)"
        ),
        count: 4,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
      {
        label: t("returnedToTreatment", "Returned To Treatment (TX_Rtt)"),
        count: 4,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
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
    ],
    "Returning To Treatment": [
      {
        label: t("newClients", "Newly Enrolled Clients"),
        count: 12,
        icon: <UserFollow size={48} />,
        color: "#3271F4",
      },
      {
        label: t("activeClients", "Active Clients (TX_CURR)"),
        count: 10,
        icon: <UserAdmin size={48} />,
        color: "#3271F4",
      },
      {
        label: t("onAppointment", "On Appointment"),
        count: 3,
        icon: <EventSchedule size={48} />,
        color: "#3271F4",
      },
      {
        label: t("missedAppointments", "Missed appointments"),
        count: 2,
        icon: <UnauthorizedUserAccess size={48} />,
        color: "#FF9D00",
      },
      {
        label: t(
          "interruptionsInTreatments",
          "Interruptions In Treatment (lit)"
        ),
        count: 4,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
      },
      {
        label: t("returnedToTreatment", "Returned To Treatment (TX_Rtt)"),
        count: 4,
        icon: <ChangeCatalog size={48} />,
        color: "#FF0000",
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
        {/* <div className={styles.titleContainer}>
          <p className={styles.subTitle}>
            {t("subPopulations", "Sub Populations")}
          </p>
        </div> */}
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
