import React, { useContext } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { useTranslation } from 'react-i18next';
import { Calendar, Hospital } from '@carbon/react/icons';
import { Button } from '@carbon/react';
import { ExtensionSlot, isDesktop, launchWorkspace, navigate, useLayoutType } from '@openmrs/esm-framework';
import { spaHomePage } from '../constants';
import SelectedDateContext from '../hooks/selectedDateContext';
import styles from './metrics-header.scss';

dayjs.extend(isToday);

const MetricsHeader: React.FC = () => {
  const { t } = useTranslation();
  const { selectedDate } = useContext(SelectedDateContext);
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? 'sm' : 'md';

  const launchCreateAppointmentForm = (patientUuid) => {
    const props = {
      patientUuid: patientUuid,
      context: 'creating',
      mutate: () => {}, // TODO get this to mutate properly
    };

    launchWorkspace('create-appointment', { ...props });
  };

  return (
    <div className={styles.metricsContainer}>
      <span className={styles.metricsTitle}>{t('appointmentMetrics', 'Appointment metrics')}</span>
      <div className={styles.metricsContent}>
        <Button
          kind="tertiary"
          renderIcon={Calendar}
          size={responsiveSize}
          onClick={() =>
            navigate({ to: `${spaHomePage}/appointments/calendar/${dayjs(selectedDate).format('YYYY-MM-DD')}` })
          }>
          {t('appointmentsCalendar', 'Appointments calendar')}
        </Button>
        <ExtensionSlot
          name="patient-search-button-slot"
          state={{
            selectPatientAction: launchCreateAppointmentForm,
            buttonText: t('createNewAppointment', 'Create new appointment'),
            overlayHeader: t('createNewAppointment', 'Create new appointment'),
            buttonProps: {
              kind: 'primary',
              renderIcon: (props) => <Hospital size={32} {...props} />,
              size: responsiveSize,
            },
          }}
        />
      </div>
    </div>
  );
};

export default MetricsHeader;
