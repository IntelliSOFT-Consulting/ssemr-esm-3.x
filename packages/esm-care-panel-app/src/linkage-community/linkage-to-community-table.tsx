import React from "react";
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
import { useRegimenEncounter } from "../hooks/useRegimenEncounter";
import { RegimenType } from "../types";

export interface PatientHistoryProps {
  patientUuid: string;
  programName: string;
}
const LinkageToCHWTable: React.FC<PatientHistoryProps> = ({
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
      key: "name",
      header: "Name of the Community Health Worker (CHW)",
    },
    {
      key: "phone",
      header: "Telephone Number",
    },
    {
      key: "landmark",
      header: "LandMark/Address Of Community Health Worker (CHW)",
    },
  ];

  const rows = [
    {
      id: "a",
      name: "John Doe",
      phone: "0712345678",
      landmark: "Juba Hills",
    },
  ];

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
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
export default LinkageToCHWTable;
