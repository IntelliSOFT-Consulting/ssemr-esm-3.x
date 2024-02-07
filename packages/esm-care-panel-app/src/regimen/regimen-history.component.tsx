import React from "react";
import { useTranslation } from "react-i18next";
import {
  StructuredListSkeleton,
  StructuredListRow,
  StructuredListCell,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  Tile,
} from "@carbon/react";
import styles from "./regimen-history.scss";
import { useRegimenHistory } from "../hooks/useRegimenHistory";
import { formatDate, parseDate, useLayoutType } from "@openmrs/esm-framework";
import { RegimenType } from "../types";

export interface RegimenHistoryProps {
  patientUuid: string;
  category: string;
}

const RegimenHistory: React.FC<RegimenHistoryProps> = ({
  patientUuid,
  category,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() == "tablet";
  const { regimen, isLoading, error } = useRegimenHistory(
    patientUuid,
    RegimenType[category]
  );

  // if (isLoading) {
  //   return <StructuredListSkeleton role="progressbar" />;
  // }

  // if (error) {
  //   return <span>{t('errorRegimenHistory', 'Error loading regimen history')}</span>;
  // }

  // if (regimen?.length === 0) {
  //   return;
  // }

  const structuredListBodyRowGenerator = () => {
    <StructuredListRow className={styles.structuredList}>
      <StructuredListCell>22.02.2-24</StructuredListCell>
      <StructuredListCell>22.02.2-24</StructuredListCell>
      <StructuredListCell>1a = AZT/3TC+EFV</StructuredListCell>
      <StructuredListCell>Test</StructuredListCell>
      <StructuredListCell>Test Reason</StructuredListCell>
      <StructuredListCell></StructuredListCell>
    </StructuredListRow>;
  };

  return (
    <section>
      <Tile className={styles.whiteBackground}>
        <div className={styles.desktopHeading}>
          <h4 className={styles.title}>
            {t("regimenHistory", "Regimen History")}
          </h4>
        </div>
        <div className={styles.structuredListBody}>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>
                  {t("start", "Start")}
                  <StructuredListCell>22.02.2024</StructuredListCell>
                </StructuredListCell>
                <StructuredListCell head>
                  {t("end", "End")}{" "}
                  <StructuredListCell>22.02.2024</StructuredListCell>
                </StructuredListCell>
                <StructuredListCell head>
                  {t("regimen", "Regimen")}
                  <StructuredListCell>1a = AZT/3TC+EFV</StructuredListCell>
                </StructuredListCell>
                <StructuredListCell head>
                  {t("regimenLine", "Regimen line")}
                  <StructuredListCell>Test</StructuredListCell>
                </StructuredListCell>
                <StructuredListCell head>
                  {t("changeReason", "Change reason")}
                  <StructuredListCell>Test Reason</StructuredListCell>
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody className={styles.structuredListBody}>
              {structuredListBodyRowGenerator()}
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      </Tile>
    </section>
  );
};

export default RegimenHistory;
