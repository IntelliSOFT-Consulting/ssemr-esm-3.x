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
const RedFlags: React.FC<PatientHistoryProps> = ({
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
      key: "redFlags",
      header: "Client Red Flags",
    },
  ];

  const rows = [
    {
      id: "a",
      redFlags: "Missed appointment, date of missed appointment - 07/02/2024",
    },
    {
      id: "b",
      redFlags: "VL due date - 07/02/2024",
    },
    {
      id: "c",
      redFlags: "Unsuppressed Viral Load - 07/02/2024",
    },
    {
      id: "d",
      redFlags: "Interrupted in treatment (IIT)- 07/02/2024",
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
export default RedFlags;
