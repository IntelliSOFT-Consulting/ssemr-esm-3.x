import React from "react";
import styles from "./patient-history-component.scss";
import { useProgramSummary } from "../hooks/useProgramSummary";
import { useTranslation } from "react-i18next";
import { formatDate, useLayoutType } from "@openmrs/esm-framework";
import {
  StructuredListSkeleton,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@carbon/react";
import RegimenButton from "../regimen-editor/regimen-button.component";
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";

export interface PatientHistoryProps {
  patientUuid: string;
  programName: string;
}
const VLStatus: React.FC<PatientHistoryProps> = ({
  patientUuid,
  programName,
}) => {
  const { data, isError, isLoading } = useProgramSummary(patientUuid);
  const { t } = useTranslation();
  const { regimenEncounter } = useRegimenEncounter(
    RegimenType[programName],
    patientUuid
  );

  const headers = [
    {
      key: "date",
      header: "Date",
    },
    {
      key: "lastvlresult",
      header: "Last VL Result",
    },
    {
      key: "vlstatus",
      header: "VL Status",
    },
  ];

  const rows = [
    {
      id: "a",
      date: "12/02/2024",
      lastvlresult: "800",
      vlstatus: "Suppressed",
    },
  ];

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()} style={{ marginBottom: "1rem" }}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </>
  );
};
export default VLStatus;
