import { useState, useEffect } from "react";

const useObservationData = (patientUuid) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/openmrs/ws/rest/v1/ssemr/dashboard/obs?patientUuid=${patientUuid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [patientUuid]);

  return {
    data,
    isLoading,
    setIsLoading,
    error,
  };
};

export default useObservationData;
