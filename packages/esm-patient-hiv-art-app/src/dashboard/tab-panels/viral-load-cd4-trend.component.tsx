import React, { useMemo } from "react";
import { LineChart } from "@carbon/charts-react";
import { InlineLoading } from "@carbon/react";

import { usePatientObs } from "../../hooks/usePatientObs";
import { useTranslation } from "react-i18next";
import { ErrorState, useConfig } from "@openmrs/esm-framework";
import { ConfigObject } from "../../config-schema";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import "../../root.scss";
import dayjs from "dayjs";

interface ViralLoadCD4TrendProps {
  patientUuid: string;
}

const ViralLoadCD4Trend: React.FC<ViralLoadCD4TrendProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();
  const { cd4ViralLoadConcepts } = useConfig<ConfigObject>();
  const { obs, isLoading, error } = usePatientObs(
    patientUuid,
    cd4ViralLoadConcepts,
  );
  const chartData =
    obs
      ?.map((result) => ({
        group:
          result?.code["text"] === "HIVTC, Viral Load"
            ? "Viral load"
            : result?.code["text"],
        date: result.effectiveDateTime,
        value: result?.valueQuantity?.value ?? result?.valueString,
        key: dayjs(result.effectiveDateTime).format("DD.MM.YYYY"),
      }))
      .splice(0, 10) ?? [];
  console.log(chartData);
  const chartOptions: any = useMemo(() => {
    return {
      title: "HIV & Art trends",
      axes: {
        bottom: {
          title: "DATES",
          mapsTo: "key",
          scaleType: "labels",
        },
        left: {
          mapsTo: "value",
          title: t("level", "LEVELS"),
          scaleType: "linear",
        },
      },

      height: "400px",
      width: "900px",
      legend: {
        position: "right",
        orientation: "vertical",
      },
      color: {
        scale: {
          "Viral load": "#2567F5",
          CD4: "#000000",
        },
      },
    };
  }, []);

  if (isLoading) {
    return <InlineLoading description={t("loading", "Loading...")} />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        headerTitle={t("errorLoadingTrendsChart", "VL & CD4 Chart error")}
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <EmptyState
        displayText="Viral load and CD4 "
        headerTitle="VL and CD4 Chart"
      />
    );
  }
  return <LineChart data={chartData} options={chartOptions} />;
};

export default ViralLoadCD4Trend;
