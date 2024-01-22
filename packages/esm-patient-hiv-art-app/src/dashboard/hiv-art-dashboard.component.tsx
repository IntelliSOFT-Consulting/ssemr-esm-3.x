import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import ViralLoadCD4Trend from './tab-panels/viral-load-cd4-trend.component';
import DashboardPanel from './tab-panels/dashboard-panel';
import { usePatientEncounters } from '../hooks/usePatientEncounters';

interface HIVArtDashboardProps {
  patientUuid: string;
}

const dashboardPanelMap = {
  clientEnrollment: {
    formUuid: '2d27155e-f40c-4339-b292-232fa4ac53ff',
    encounterType: 'f469b65f-a4f6-4723-989a-46090de6a0e5',
    dashboardTitle: 'Client enrollment',
    errorMessage: 'Client enrollment',
  },
  initialHIVCareAndART: {
    formUuid: 'a5b831b5-168f-4de3-9975-7277f3ed4945',
    encounterType: '81852aee-3f10-11e4-adec-0800271c1b75',
    dashboardTitle: 'Initial HIV care and ART',
    errorMessage: 'Initial HIV care and ART',
  },
  artTreatmentInteruption: {
    formUuid: '32229880-468e-4ce2-96bd-a61a999c1743',
    encounterType: '81fbaddd-3f10-11e4-adec-0800271c1b75',
    dashboardTitle: 'ART treatment interruption',
    errorMessage: 'ART treatment interruption',
  },
  endOfFollowUp: {
    formUuid: '61c0c516-f240-423f-8fc0-14e478809480',
    encounterType: '81e13b91-3f10-11e4-adec-0800271c1b75',
    dashboardTitle: 'Treatment Outcome',
    errorMessage: 'end of Follow-up',
  },
  arvRegimen: {
    dashboardTitle: 'ARV Regimen',
    errorMessage: 'ARV Regimen',
  },
};

const HIVArtDashboard: React.FC<HIVArtDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { encounters, isLoading, error } = usePatientEncounters(patientUuid);

  return (
    <Tabs>
      <TabList aria-label="List of tabs" contained>
        <Tab>{t('viralLoadAndCDTrend', 'Viral load and CD4 trends')}</Tab>
        {Object.values(dashboardPanelMap).map((panel) => (
          <Tab key={panel}>{t(panel.dashboardTitle, panel.dashboardTitle)}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <ViralLoadCD4Trend patientUuid={patientUuid} />
        </TabPanel>
        {Object.values(dashboardPanelMap).map((panel) => (
          <TabPanel key={panel}>
            {panel.dashboardTitle === 'ARV Regimen' ? (
              <div>This is the content for the ARV Regimen tab</div>
            ) : (
              <DashboardPanel
                patientUuid={patientUuid}
                isLoading={isLoading}
                {...panel}
                encounters={encounters}
                error={error}
              />
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default HIVArtDashboard;
