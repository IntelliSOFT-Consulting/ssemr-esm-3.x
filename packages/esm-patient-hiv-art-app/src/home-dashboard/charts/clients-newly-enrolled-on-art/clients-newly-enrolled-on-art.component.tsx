import React, { useState, useEffect, useRef } from "react";
import { AreaChart } from "@carbon/charts";
import "@carbon/charts/styles.css";

const EnrolledOnArtChart = ({ options }) => {
  const chartRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState("week");
  const [, setChartData] = useState([]);

  const getDaysOfWeekData = () => {
    const daysOfWeekData = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].map((day, i) => ({
      group: "Clients newly enrolled on ART on",
      date: day,
      value: Math.floor(Math.random() * 10) + 1,
    }));
    return daysOfWeekData;
  };

  const getDaysOfMonthData = () => {
    const daysOfMonthData = Array.from({ length: 31 }, (_, i) => ({
      group: "Clients newly enrolled on ART on",
      date: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 10) + 1,
    }));
    return daysOfMonthData;
  };

  const getMonthsOfYearData = () => {
    const monthsOfYearData = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].map((month, i) => ({
      group: "Clients newly enrolled on ART in",
      date: month,
      value: Math.floor(Math.random() * 10) + 1,
    }));
    return monthsOfYearData;
  };

  useEffect(() => {
    if (chartRef.current) {
      const data =
        selectedRange === "week"
          ? getDaysOfWeekData()
          : selectedRange === "month"
          ? getDaysOfMonthData()
          : getMonthsOfYearData();

      new AreaChart(chartRef.current, {
        data,
        options,
      });

      setChartData(data);
    }
  }, [selectedRange, options]);

  return (
    <div>
      <div>
        {/* <button
          onClick={() => setSelectedRange("week")}
          disabled={selectedRange === "week"}
        >
          Week
        </button>
        <button
          onClick={() => setSelectedRange("month")}
          disabled={selectedRange === "month"}
        >
          Month
        </button>
        <button
          onClick={() => setSelectedRange("year")}
          disabled={selectedRange === "year"}
        >
          Year
        </button> */}
        <div ref={chartRef}></div>
      </div>
    </div>
  );
};

export default EnrolledOnArtChart;
