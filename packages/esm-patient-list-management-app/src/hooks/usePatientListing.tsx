import { useTranslation } from "react-i18next";
import React from "react";
import { openmrsFetch } from "@openmrs/esm-framework";
import Link from "@carbon/react/lib/components/UIShell/Link";

export const usePatientListing = (initialCategory="allClients") => {
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
  const [category, setCategory] = React.useState(initialCategory);

  const abortControllerRef = React.useRef(null)

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
    {
      name: "Next Appointment Date",
      selector: (row) => row.appointmentDate,
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
        setCategory("allClients");
        break;

      case 1:
        setCategory("activeClients");
        break;

      case 2:
        setCategory("interruptedInTreatment")
        break;

      case 3:
        setCategory("transferredOut")
        break;

      case 4:
        setCategory("deceased")
        break;

      default:
        setCategory("allClients");
    }
  };

  const getClients = async ({ currentPage, pageSize }) => {
    if(abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      if (currentPage === 0) setLoading(true);

      const url = `/ws/rest/v1/ssemr/dashboard/${category}?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&size=${pageSize}`;

      setCurrentPaginationState((prev) => ({ ...prev, done: false }));

      const { data } = await openmrsFetch(url, {
        signal: controller.signal
      });
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

  const parseDate = (dateStr: string) => {
    if(!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  React.useEffect(() => {
    if (currentTab === 0) {
      setTableHeaders([...defaultTableHeaders]);
    }
    if (currentPaginationState.page > 0) {
      getClients({
        currentPage: currentPaginationState.page,
        pageSize: currentPaginationState.size,
      })
    }
  }, [currentPaginationState.page, currentTab]);


  React.useEffect(() => {
    getClients({
      currentPage: currentPaginationState.page,
      pageSize: currentPaginationState.size,
    });
  }, [category]);

  React.useEffect(() => {
    const filteredItems = tableData
      .filter((row) =>
        row?.name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
        row?.identifiers?.find((item) =>
          item?.identifierType?.toLowerCase()?.includes("art")
        )?.identifier?.toLowerCase()?.includes(filterText.toLowerCase())
      )
      .map((row, index) => ({ ...row, serialNumber: index + 1 }))
      .sort((a, b) => {
        const dateA: any = parseDate(a.initiationDate);
        const dateB: any = parseDate(b.initiationDate);

        if(!dateA && !dateB) return -1;
        if(!dateA) return 1;
        if(!dateB) return -1;

        return dateB - dateA;

      });
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
