import React, { useContext } from "react";
import { SimpleBarChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import { ScaleTypes } from "../types";
import styles from "./styles/index.scss";
import { Loading } from "@carbon/react";
import { DashboardContext } from "../context/DashboardContext";

const HighViralLoadCascade = () => {
  const {
    chartData: { highViralLoad },
    currentTimeFilter,
  } = useContext(DashboardContext);

  const options = {
    title: "High viral load cascade",
    axes: {
      bottom: {
        title: "",
        mapsTo: "group",
        scaleType: "labels" as ScaleTypes,
      },
      left: {
        mapsTo: "value",
      },
    },
    curve: "curveMonotoneX",
    height: "400px",
  };

  return (
    <div className={styles.chartContainer}>
      {highViralLoad?.processedChartData?.length === 0 ? (
        <div className={styles.noRecords}>
          <p style={{ marginBottom: "25%", fontWeight: 500 }}>
            High viral load cascade
          </p>
          <p className={styles.noRecordsText}>No records</p>
        </div>
      ) : highViralLoad?.processedChartData?.length > 0 &&
        highViralLoad?.processedChartData[0][currentTimeFilter] ? (
        <SimpleBarChart
          data={highViralLoad?.processedChartData}
          options={options}
        />
      ) : (
        <Loading className={styles.spinner} withOverlay={false} />
      )}
    </div>
  );
};

export default HighViralLoadCascade;
