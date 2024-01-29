export default {
  title: "Clients newly enrolled on ART",
  height: "300px",
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
      mapsTo: "date",
      scaleType: "labels",
    },
    left: {
      visible: true,
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
