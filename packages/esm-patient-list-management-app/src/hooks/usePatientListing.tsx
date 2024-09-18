import { useTranslation } from "react-i18next";
import React from "react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { Tag } from "@carbon/react";
import styles from "../views/lists-dashboard.scss";
import Link from "@carbon/react/lib/components/UIShell/Link";

export const usePatientListing = () => {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = React.useState(0);
  const [tableHeaders, setTableHeaders] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [filteredTableData, setFilteredTableData] = React.useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [currentPaginationState, setCurrentPaginationState] = React.useState({
    page: 0,
    size: 15,
    done: true,
  });

  const startDate = `1970-01-01`;

  const endDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const tabs = [
    {
      id: "allClients",
      text: t("allClients", "All Clients"),
      activeClassName: "darkActive",
      interClassName: "darkInert",
    },
    {
      id: "activeClients",
      text: t("activeClients", "Active Clients"),
      activeClassName: "greenActive",
      interClassName: "greenInert",
    },
    {
      id: "IIT",
      text: t("iit", "IIT Clients"),
      activeClassName: "amberActive",
      interClassName: "amberInert",
    },
    {
      id: "TAD",
      text: t("transferOut", "Transferred Out Clients"),
      activeClassName: "blueActive",
      interClassName: "blueInert",
    },
    {
      id: "Died",
      text: t("died", "Died"),
      activeClassName: "redActive",
      interClassName: "redInert",
    },
  ];

  const defaultTableHeaders = [
    {
      name: "SN",
      selector: (row, index) => row.serialNumber,
    },
    {
      name: "Name",
      cell: (row) => (
        <Link
          href={`${window.getOpenmrsSpaBase()}patient/${
            row.uuid
          }/chart/Patient%20Summary`}
        >
          {row.name}
        </Link>
      ),
    },
    {
      name: "Age",
      selector: (row) => row.age,
    },
    {
      name: "Sex",
      selector: (row) => row.sex,
    },
    {
      name: "UAN",
      selector: (row) =>
        row?.identifiers?.find((item) =>
          item?.identifierType?.toLowerCase()?.includes("art")
        )?.identifier,
    },
    {
      name: "ART Regimen",
      selector: (row) => row?.ARTRegimen,
    },
    {
      name: "Date of initiation",
      selector: (row) => row.initiationDate,
    },
    {
      name: "Last Refill Date",
      selector: (row) => row.lastRefillDate,
    },
  ];

  const handleTabChange = (selectedIndex) => {
    setCurrentTab(selectedIndex);
    //reset state variables
    setTableData([]);
    setTableHeaders(defaultTableHeaders);
    setCurrentPaginationState((prev) => ({
      ...prev,
      page: 0,
      size: 15,
    }));

    switch (selectedIndex) {
      case 0:
        getAllClients({
          currentPage: currentPaginationState.page,
          pageSize: currentPaginationState.size,
        });
        break;

      case 1:
        getActiveClients();
        break;

      case 2:
        getIIT();
        break;

      case 3:
        getTransferredOut();
        break;

      case 4:
        getDeceased();
        break;

      default:
        getAllClients({
          currentPage: currentPaginationState.page,
          pageSize: currentPaginationState.size,
        });
    }
  };

  const getChartData = async ({ url, responseCallback, errorCallBack }) => {
    try {
      setLoading(true);
      const response = await openmrsFetch(url);
      responseCallback(response.data);
    } catch (error) {
      errorCallBack(error);
    } finally {
      setLoading(false);
    }
  };

  const getChipClassName = ({ clinicalStatus }) => {
    switch (clinicalStatus) {
      case "ACTIVE":
        return "greenChip";
      case "INTERRUPTED_IN_TREATMENT":
        return "amberChip";
      case "TRANSFERRED_OUT":
        return "blueChip";
      case "DIED":
        return "redChip";
      default:
        return "grayChip";
    }
  };

  const getAllClients = async ({ currentPage, pageSize }) => {
    try {
      if (currentPage === 0) setLoading(true);

      const url = `/ws/rest/v1/ssemr/dashboard/allClients?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&size=${pageSize}`;

      setCurrentPaginationState((prev) => ({ ...prev, done: false }));

      const { data } = await openmrsFetch(url);
      if (data?.results?.length > 0)
        setTableData((prev) => [...prev, ...data.results]);

      if (data?.results?.length === pageSize)
        setCurrentPaginationState((prev) => ({
          ...prev,
          page: ++prev.page,
        }));

      if (data?.results?.length === 0 || data?.results?.length < pageSize) {
        setCurrentPaginationState((prev) => ({ ...prev, page: 0, done: true }));
        setLoading(false);
      }
    } catch (e) {
      return e;
    }
  };

  React.useEffect(() => {
    if (currentTab === 0) {
      setTableHeaders([
        ...defaultTableHeaders,
        {
          name: "Clinical Status",
          button: true,
          cell: (row) => (
            <Tag
              className={
                styles[getChipClassName({ clinicalStatus: row.clinicalStatus })]
              }
              size="md"
            >
              {row.clinicalStatus.toLowerCase().includes("interrupt")
                ? "IIT"
                : row.clinicalStatus.toLowerCase().includes("transfer")
                ? "TO"
                : row.clinicalStatus}
            </Tag>
          ),
        },
      ]);
    }
    if (currentPaginationState.page > 0)
      getAllClients({
        currentPage: currentPaginationState.page,
        pageSize: currentPaginationState.size,
      });
  }, [currentPaginationState.page, currentTab]);

  const getActiveClients = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/activeClients?startDate=${startDate}&endDate=${endDate}`,
      responseCallback: (data) => {
        setTableData(data.results);
        setTableHeaders(defaultTableHeaders);
      },
      errorCallBack: (error) => console.error(error),
    });

  const getIIT = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/interruptedInTreatment?startDate=${startDate}&endDate=${endDate}`,
      responseCallback: (data) => {
        setTableData(data.results);
        setTableHeaders(defaultTableHeaders);
      },
      errorCallBack: (error) => console.error(error),
    });

  const getTransferredOut = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/transferredOut?startDate=${startDate}&endDate=${endDate}`,
      responseCallback: (data) => {
        setTableData(data.results);
        setTableHeaders(defaultTableHeaders);
      },
      errorCallBack: (error) => console.error(error),
    });

  const getDeceased = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/deceased?startDate=${startDate}&endDate=${endDate}`,
      responseCallback: (data) => {
        setTableData(data.results);
        setTableHeaders(defaultTableHeaders);
      },
      errorCallBack: (error) => console.error(error),
    });

  React.useEffect(() => {
    getAllClients({
      currentPage: currentPaginationState.page,
      pageSize: currentPaginationState.size,
    });
  }, []);

  React.useEffect(() => {
    const filteredItems = tableData
      .filter((row) =>
        row.name.toLowerCase().includes(filterText.toLowerCase())
      )
      .map((row, index) => ({ ...row, serialNumber: index + 1 }));
    setFilteredTableData(filteredItems);
    setResetPaginationToggle((prev) => !prev);
  }, [filterText, tableData]);

  return {
    tabs,
    currentTab,
    setCurrentTab,
    tableHeaders,
    tableData,
    handleTabChange,
    filterText,
    setFilterText,
    resetPaginationToggle,
    setResetPaginationToggle,
    loading,
    filteredTableData,
    currentPaginationState,
  };
};
