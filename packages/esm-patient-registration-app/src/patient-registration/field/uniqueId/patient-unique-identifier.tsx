import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tile,
  ComboBox,
  Layer,
  Button,
  Search,
  InlineLoading,
} from "@carbon/react";
import { Input } from "../../input/basic-input/input/input.component";
import { SelectInput } from "../../input/basic-input/select/select-input.component";
import styles from "./patient-unique-identifier.scss";
import { showToast } from "@openmrs/esm-framework";
import { FormikProps } from "formik";
import { FormikValues } from "formik";
import { states, facilities } from "./assets/identifier-assets";

interface PatientIdentifierProps {
  props: FormikProps<FormikValues>;
}

interface InputProps {
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
}

export const PatientArtNumber: React.FC<InputProps> = () => {
  const { t } = useTranslation();

  const [selectedState, setSelectedState] = useState<string>("State1");
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const facilitiesForSelectedState = facilities[selectedState] || [];

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setSelectedState(newState);
    // Reset facility when state changes
    setSelectedFacility("");
  };

  const handleFacilityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newFacility = event.target.value;
    setSelectedFacility(newFacility);
  };

  return (
    <div id="patientIdentifier">
      <h6
        className={styles.productiveHeading01}
        style={{ color: "#161616", marginTop: "1rem" }}
      >
        {t("uniqueArtNumber", "Unique ART Number")}
      </h6>
      <div>
        <Tile className={styles.wrapper}>
          <Layer>
            <SelectInput
              name="states"
              options={states}
              label={t("states", "State")}
              required
              onChange={handleStateChange}
              value={selectedState}
            />
          </Layer>
          <Layer>
            <SelectInput
              name="facility"
              label={t("facility", "Facility")}
              required
              onChange={handleFacilityChange}
              options={facilitiesForSelectedState}
              value={selectedFacility}
            />
          </Layer>
          <Layer>
            <Input
              id="artNumber"
              name="artNumber"
              labelText={t("number", "Number")}
              light={true}
              required
            />
          </Layer>
        </Tile>
      </div>
    </div>
  );
};
