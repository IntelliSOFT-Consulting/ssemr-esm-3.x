import React, { useContext } from "react";
import { Home } from "@carbon/react/icons";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import StatCardComponent from "../components/cards/stat-card.component";
import SSEMRTab from "../components/tabs/SSEMRTab";
import { DashboardContext } from "../context/DashboardContext";
import { TimeFilter } from "../components/filter/TimeFilter";
import { Routes, Route } from "react-router-dom";
import GenericChartsComponent from "../components/chart-sections/generic-charts.component";
import ChartSelectorTabsComponent from "../components/tabs/chart-selector-tabs.component";
import ViralLoadChartsComponent from "../components/chart-sections/viral-load-charts.component";
import ComplexCharts from "../components/chart-sections/complex-charts.component";

const HomeDashboard = () => {
  const { t } = useTranslation();

  const { stats, filterTabs, currentTopFilterIndex } =
    useContext(DashboardContext);

  return (
    <div className={styles.container}>
      {/* ................Title......................... */}
      <div className={styles.header}>
        <div className={styles["left-justified-items"]}>
          <Home color="green" size="34" className={styles.homeIcon} />
          <div className={styles["page-labels"]}>
            <p className={styles.title}>
              {t("hivCareAndARTDashboard", "HIV Care and ART Dashboard")}
            </p>
          </div>
        </div>
        <div
          style={{
            width: "fit-content",
            maxWidth: "500px",
          }}
        >
          <TimeFilter />
        </div>
      </div>
      <div className={styles.artBody}>
        {/* ..................Tabs................. */}
        <div className={styles.tabs}>
          {filterTabs.map((item) => (
            <SSEMRTab
              index={item.index}
              name={item.title}
              key={item.title}
              handler={item.filterFunction}
              isActive={currentTopFilterIndex == item.index}
            />
          ))}
        </div>

        {/* ...................Stats.................... */}
        <div className={styles.stats}>
          {stats.map(
            (stat) =>
              stat?.stat && <StatCardComponent item={stat} key={stat.title} />
          )}
        </div>
        <ChartSelectorTabsComponent />
        <Routes>
          <Route path="/" element={<GenericChartsComponent />} />
          <Route
            path="/viral-load-charts"
            element={<ViralLoadChartsComponent />}
          />
          <Route path="/waterfall-chart" element={<ComplexCharts />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomeDashboard;
