import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, EmptyState, PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import { usePagination } from '@openmrs/esm-framework';

interface DashboardTableProps {
  patientUuid: string;
  tableHeaders: Array<Record<string, string>>;
  tableRows: Array<any>;
  launchForm: () => void;
  dashboardTitle: string;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ launchForm, tableHeaders, tableRows, dashboardTitle }) => {
  const { t } = useTranslation();

  const { results, currentPage, goTo } = usePagination(tableRows, 10);

  if (tableRows.length === 0) {
    return <EmptyState displayText={dashboardTitle} headerTitle={dashboardTitle} launchForm={launchForm} />;
  }
  return (
    <div>
      <CardHeader title={dashboardTitle}>
        <Button
          kind="ghost"
          renderIcon={(props) => <Add size={16} {...props} />}
          iconDescription={t('add', 'Add')}
          onClick={() => launchForm()}
        >
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <DataTable rows={results} headers={tableHeaders}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
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
      <PatientChartPagination
        currentItems={results.length}
        totalItems={tableRows.length}
        pageNumber={currentPage}
        pageSize={10}
        onPageNumberChange={({ page }) => goTo(page)}
      />
    </div>
  );
};

export default DashboardTable;
