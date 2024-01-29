/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Tile,
  ComboBox,
  Layer,
  Button,
  Search,
  InlineLoading,
  Select,
  SelectItem,
  TextInput,
} from "@carbon/react";
import { Input } from "../../input/basic-input/input/input.component";
import { SelectInput } from "../../input/basic-input/select/select-input.component";
import styles from "./patient-unique-identifier.scss";
import { showToast } from "@openmrs/esm-framework";
import { FormikProps } from "formik";
import { FormikValues } from "formik";
import { facilities } from "./assets/identifier-assets";

interface PatientIdentifierProps {
  props: FormikProps<FormikValues>;
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
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

export const PatientArtNumber: React.FC<PatientIdentifierProps> = () => {
  const { t } = useTranslation();

  const states = Object.keys(facilities[0]);
  const [selectedState, setSelectedState] = useState<string>("State1");
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [artNumber, setArtNumber] = useState<string>("");
  const [facilitiesForSelectedState, setfacilitiesForSelectedState] = useState<
    string[]
  >([""]);

  const [combinedValue, setCombinedValue] = useState<string>("");

  const Input = (props) => {
    const handleChange = (event) => {
      props.onChange(event);
    };
    return <TextInput {...props} onChange={handleChange} />;
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("event", event);
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedFacility("");
  };

  const handleFacilityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newFacility = event.target.value;
    setSelectedFacility(newFacility);
  };

  const handleArtNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newArtNumber = event.target.value;
    console.log("Art Number changed:", newArtNumber);
    setArtNumber(newArtNumber);
  };

  useEffect(() => {
    setCombinedValue(`${selectedFacility}${artNumber}`);
  }, [selectedFacility, artNumber]);

  //To-Do
  useEffect(() => {
    if (selectedState) {
      setfacilitiesForSelectedState(facilities[0][selectedState]);
    }
  }, [selectedState]);

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
            <Select
              value={selectedState}
              onChange={handleStateChange}
              id="states"
              labelText={t("states", "State")}
            >
              <SelectItem value="" text="" />
              {states.map((state) => (
                <SelectItem value={state} text={state} key={state} />
              ))}
            </Select>
          </Layer>
          <Layer>
            <Select
              value={selectedFacility}
              onChange={handleFacilityChange}
              id="facility"
              labelText={t("facilities", "Facilities")}
            >
              <SelectItem value="" text="" />
              {facilitiesForSelectedState?.map((facility: any) => (
                <SelectItem
                  value={facility?.code}
                  text={facility?.name}
                  key={facility?.code}
                />
              ))}
            </Select>
          </Layer>
          <Layer>
            <Input
              value={artNumber}
              onChange={handleArtNumberChange}
              id="artNumber"
              name="artNumber"
              labelText={t("number", "Number")}
              light={true}
              required
            />
          </Layer>
        </Tile>
      </div>
      <div>ART Number: {combinedValue}</div>
    </div>
  );
};
