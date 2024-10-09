import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import classNames from 'classnames';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import { Layer, RadioButtonGroup, RadioButton, Search, StructuredListSkeleton } from '@carbon/react';
import { PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import { useLayoutType, usePagination, type VisitType } from '@openmrs/esm-framework';
import { type VisitFormData } from './visit-form.resource';
import styles from './visit-type-overview.scss';
import { TextInput } from '@carbon/react';

interface BaseVisitTypeProps {
  visitTypes: Array<VisitType>;
}

const BaseVisitType: React.FC<BaseVisitTypeProps> = ({ visitTypes }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { control } = useFormContext<VisitFormData>();
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [otherText, setOtherText] = useState<string>('');

  const searchResults = useMemo(() => {
    if (!isEmpty(searchTerm)) {
      return visitTypes.filter((visitType) => visitType.display.toLowerCase().search(searchTerm.toLowerCase()) !== -1);
    } else {
      return visitTypes;
    }
  }, [searchTerm, visitTypes]);

  const handleSearch = useMemo(() => debounce((searchTerm) => setSearchTerm(searchTerm), 300), []);

  const { results, currentPage, goTo } = usePagination(searchResults, 5);

  const otherSelected = (value: string) => {
    if (value === '5532b8be-2b98-4bff-997b-66e9873a95bd') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
    }
  }

  return (
    <>
      <div className={classNames(styles.visitTypeOverviewWrapper, isTablet ? styles.tablet : styles.desktop)}>
        {visitTypes.length ? (
          <>
            {isTablet ? (
              <Layer>
                <Search
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder={t('searchForAVisitType', 'Search for a visit type')}
                  labelText=""
                />
              </Layer>
            ) : (
              <Search
                onChange={(event) => handleSearch(event.target.value)}
                placeholder={t('searchForAVisitType', 'Search for a visit type')}
                labelText=""
              />
            )}

            <Controller
              name="visitType"
              control={control}
              defaultValue={results?.length === 1 ? results[0].uuid : ''}
              render={({ field: { onChange, value } }) => (
                <RadioButtonGroup
                  className={styles.radioButtonGroup}
                  orientation="vertical"
                  onChange={ (val) => {
                    onChange(val);
                    otherSelected(val);
                  }}
                  name="radio-button-group"
                  valueSelected={value}
                >
                  {results.map(({ uuid, display, name }) => (
                    <RadioButton key={uuid} className={styles.radioButton} id={name} labelText={display} value={uuid} />
                  ))}
                </RadioButtonGroup>
              )}
            />
            <div className={styles.paginationContainer}>
              <PatientChartPagination
                pageNumber={currentPage}
                totalItems={visitTypes?.length}
                currentItems={results.length}
                pageSize={5}
                onPageNumberChange={({ page }) => goTo(page)}
              />
            </div>
          </>
        ) : (
          <StructuredListSkeleton />
        )}
      </div>

      {isOtherSelected && (
        <Layer>
          <TextInput
            id="other-text-input"
            labelText={t('specifyOther', 'Please specify')}
            value={otherText}
            onChange={(event) => setOtherText(event.target.value)}
            className={styles.otherTextInput}
          />
        </Layer>
      )}
    </>
  );
};

export default BaseVisitType;
