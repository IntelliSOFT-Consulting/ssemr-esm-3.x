export default {
  title: "",
  height: "200px",
  grid: {
    x: {
      enabled: false,
    },
    y: {
      enabled: false,
    },
  },
  axes: {
    bottom: {
      visible: true,
      title: "Month",
      mapsTo: "month",
      scaleType: "labels",
    },
    left: {
      visible: true,
      title: "Weight (kg)",
      mapsTo: "value",
      scaleType: "linear",
    },
  },
  color: {
    gradient: {
      enabled: true,
    },
  },
  points: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
};
