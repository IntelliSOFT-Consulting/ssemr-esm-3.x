import React, { useContext } from "react";
import { SimpleBarChart } from "@carbon/charts-react";
import { Loading } from "@carbon/react";
import "@carbon/charts/styles.css";
import styles from "./styles/index.scss";
import { DashboardContext } from "../context/DashboardContext";
import { ScaleTypes } from "../types";

const NewlyEnrolled = () => {
  const {
    chartData: { newlyEnrolledClients },
    currentTimeFilter,
  } = useContext(DashboardContext);

  const options = {
    title: "Clients newly enrolled on ART",
    axes: {
      bottom: {
        title: "",
        mapsTo: currentTimeFilter,
        scaleType: "labels" as ScaleTypes,
      },
      left: {
        title: " Number of clients",
        mapsTo: "clients",
        scaleType: "linear" as ScaleTypes,
      },
    },
    curve: "curveMonotoneX",
    height: "400px",
  };

  return (
    <div className={styles.chartContainer}>
      {newlyEnrolledClients?.processedChartData?.length === 0 ? (
        <div className={styles.noRecords}>
          <p className={styles.noRecordsTitle}>Clients newly enrolled on ART</p>
          <p className={styles.noRecordsText}>No records</p>
        </div>
      ) : newlyEnrolledClients?.processedChartData?.length > 0 &&
        newlyEnrolledClients?.processedChartData[0][currentTimeFilter] ? (
        <SimpleBarChart
          data={newlyEnrolledClients?.processedChartData}
          options={options}
        />
      ) : (
        <Loading className={styles.spinner} withOverlay={false} />
      )}
    </div>
  );
};

export default NewlyEnrolled;
