/* eslint-disable no-console */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Tile,
  Layer,
  Select,
  SelectItem,
  TextInput,
  Button,
} from "@carbon/react";
import styles from "./patient-unique-identifier.scss";
import { FormikProps, FormikValues } from "formik";
import { facilities } from "./assets/identifier-assets";

interface PatientIdentifierProps {
  props: FormikProps<FormikValues>;
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  disabled?: boolean;
  placeholder?: string;
  value: string;
}

interface CustomInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  onBlur,
  id,
  name,
  labelText,
  light,
  required = false,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <TextInput
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      id={id}
      name={name}
      labelText={labelText}
      light={light}
      required={required}
    />
  );
};

export { CustomInput };

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

  const handleBlur = () => {
    console.log("Input blurred");
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

  const handleSubmit = () => {
    const data = {
      identifiers: [
        {
          combinedValue: combinedValue,
          identifierType: "e6baf185-38ed-4815-9476-f98d2cc2b331",
          preferred: true,
        },
      ],
    };

    fetch("/openmrs/ws/rest/v1/patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
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
            <CustomInput
              value={artNumber}
              onChange={handleArtNumberChange}
              onBlur={handleBlur}
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
