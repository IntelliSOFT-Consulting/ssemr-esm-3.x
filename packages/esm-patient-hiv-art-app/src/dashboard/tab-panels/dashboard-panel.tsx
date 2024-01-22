import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { ErrorState, formatDate, useVisit } from '@openmrs/esm-framework';
import { InlineLoading } from '@carbon/react';
import DashboardTable from '../dashboard-table/dashboard-table.component';
import { ResultItem } from '../../types';

interface DashboardPanel {
  patientUuid: string;
  dashboardTitle: string;
  errorMessage: string;
  isLoading: boolean;
  encounters: Array<ResultItem>;
  error: Error;
  formUuid?: string;
  encounterType?: string;
}

const DashboardPanel: React.FC<DashboardPanel> = ({
  patientUuid,
  encounters,
  isLoading,
  errorMessage,
  error,
  dashboardTitle,
  formUuid,
  encounterType,
}) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisit(patientUuid);

  const headers = useMemo(() => {
    return [
      {
        key: 'dateFilled',
        header: t('dateFilled', 'Date Filled'),
      },
      {
        key: 'place',
        header: t('place', 'Place'),
      },
      {
        key: 'dateTested',
        header: t('dateTested', 'Date Tested'),
      },
      {
        key: 'visitTime',
        header: t('visitTime', 'Visit Time'),
      },
      {
        key: 'visitType',
        header: t('visitType', 'Visit Type'),
      },
    ];
  }, []);

  const handleOpenForm = () =>
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: dashboardTitle,
      formInfo: { encounterUuid: '', formUuid: formUuid, visit: currentVisit },
    });
  const tableRows =
    encounters
      ?.filter((enc) => enc.form.encounterType.uuid === encounterType)
      .map((encounter) => ({
        id: `${encounter.uuid}`,
        dateFilled: formatDate(new Date(encounter.encounterDatetime)),
        place: encounter.visit?.location?.display,
        dateTested: encounter?.visit?.startDatetime ? formatDate(new Date(encounter.visit.startDatetime)) : '--',
        visitTime: encounter?.visit?.stopDatetime
          ? formatDate(new Date(encounter.visit.stopDatetime), { time: true })
          : '--',
        visitType: encounter?.visit?.visitType?.display,
      })) ?? [];

  if (isLoading) {
    return <InlineLoading description={t('loading', 'Loading...')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={errorMessage} />;
  }

  return (
    <DashboardTable
      launchForm={handleOpenForm}
      tableHeaders={headers}
      tableRows={tableRows}
      patientUuid={patientUuid}
      dashboardTitle={dashboardTitle}
    />
  );
};

export default DashboardPanel;
