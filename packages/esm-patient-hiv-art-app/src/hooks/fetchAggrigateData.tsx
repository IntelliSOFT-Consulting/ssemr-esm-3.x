import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { openmrsFetch } from "@openmrs/esm-framework";

export function useDashboardData(
  endpoint: string,
  label: string,
  category: string,
  ageFilter?: string
) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      let url = `/ws/rest/v1/ssemr/dashboard/${endpoint}`;

      if (ageFilter) {
        url += `?age=${ageFilter}`;
      }

      const response = await openmrsFetch(url);
      const data = await response.json();

      if (Array.isArray(data.data)) {
        const totalCount = data.data.reduce(
          (totalCount, item) =>
            item.label === t(label, category) ? item.count : totalCount,
          0
        );

        setCount(totalCount);
      } else {
        console.error("Invalid data format:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error(`Error fetching ${label} data:`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [t, ageFilter]);

  return { loading, count };
}
