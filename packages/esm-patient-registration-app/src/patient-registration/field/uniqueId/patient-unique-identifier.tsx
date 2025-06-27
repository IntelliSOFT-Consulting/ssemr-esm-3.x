import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Tile,
  Layer,
  Select,
  SelectItem,
  TextInput,
  Checkbox,
  SkeletonPlaceholder,
} from "@carbon/react";
import styles from "./patient-unique-identifier.scss";
import { FormikProps, FormikValues } from "formik";
import { facilities } from "./assets/identifier-assets";
import { CustomFieldsContext } from "../../CustomFieldsContext";
import { openmrsFetch } from "@openmrs/esm-framework";
import { ResourcesContext } from "../../../offline.resources";
import {
  findFacilityMetadata,
  getStateAndFacilityByCode,
  getNextARTNumber,
} from "../../helpers/findFacilityMetadata";
import { PatientRegistrationContext } from "../../patient-registration-context";
import { extractCode, isValidART } from "../../helpers/findValidART";
import { useGetFilteredPatients } from "../field.resource";

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
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  required?: boolean;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  id,
  name,
  labelText,
  light,
  required = false,
  disabled = false,
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
      onKeyDown={handleKeyDown}
      id={id}
      name={name}
      labelText={labelText}
      light={light}
      required={required}
      disabled={disabled}
    />
  );
};

export { CustomInput };

export const PatientArtNumber: React.FC<PatientIdentifierProps> = () => {
  const { t } = useTranslation();

  const { changeART, artNumber: contextArt } = useContext(CustomFieldsContext);
  const { currentSession, identifierTypes } = useContext(ResourcesContext);
  const { isLoading, inEditMode, initialFormValues } = useContext(
    PatientRegistrationContext
  );

  /**
   * useEffect to initialize the ART NUMBER if it exists in the initial form values
   */
  useEffect(() => {
    if (initialFormValues?.identifiers?.uniqueArtNumber) {
      changeART(
        initialFormValues.identifiers.uniqueArtNumber.identifierValue,
        initialFormValues.identifiers.uniqueArtNumber.identifierUuid
      );
    }
  }, [initialFormValues]);

  const states = Object.keys(facilities[0]);
  const [selectedState, setSelectedState] = useState<string>("State1");
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [artNumber, setArtNumber] = useState<string>(
    contextArt.identifierValue.split("/").at(-1)
  );
  const { data: filteredPatients } = useGetFilteredPatients(selectedFacility);

  useEffect(() => {
    if (isValidART(contextArt.identifierValue)) {
      if (contextArt?.identifierValue.includes("TI-")) {
        setTransferIn(true);
      }
      const code = extractCode(contextArt.identifierValue);
      const artNumberStateAndFacility = getStateAndFacilityByCode(code);

      setSelectedState(artNumberStateAndFacility.state);

      setSelectedFacility(code);

      setArtNumber(contextArt.identifierValue.split("/").at(-1));
    }
  }, [contextArt]);

  const [facilitiesForSelectedState, setfacilitiesForSelectedState] = useState<
    string[]
  >([""]);
  const [transferIn, setTransferIn] = useState(false);

  const [combinedValue, setCombinedValue] = useState<string>("");

  const artNumbers = filteredPatients
    ?.flatMap((patient) =>
      patient.identifiers
        .filter(
          (identifier) => identifier.identifierType === "Unique ART Number"
        )
        .map((id) => id.identifier)
    )
    .filter((art) => art?.startsWith(selectedFacility));

  const location = currentSession?.sessionLocation?.display;

  /**
   * We will use these when we load locations in the database
   * @param url
   */
  async function* fetchLocationsWithPagination(url: string) {
    let hasMorePages = true;
    let currentUrl = url;

    while (hasMorePages) {
      try {
        const { data } = await openmrsFetch(`${currentUrl}`);
        yield data.results;
        /**
         * check if there's a next page based on the returned links (or pagination attributes)
         *
         */
        if (data?.links?.length > 0 && data.links[0].rel === "next") {
          currentUrl = data.links[0].uri.split("openmrs")[1];
        } else {
          hasMorePages = false;
        }
      } catch (e) {
        hasMorePages = false;
      }
    }
  }

  const getCurrentLocation = async () => {
    try {
      const { data } = await openmrsFetch(`/ws/rest/v1/location/${location}`);
      const metadata = findFacilityMetadata(data.display);
      if (metadata && !contextArt.identifierUuid) {
        setSelectedState(metadata.state);
        setSelectedFacility(metadata.facility.code);
      }
    } catch (e) {
      return e;
    }
  };

  useEffect(() => {
    if (!inEditMode) getCurrentLocation();
  }, [transferIn]);

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    setArtNumber(newArtNumber);
  };

  useEffect(() => {
    if (!transferIn && selectedFacility && artNumbers) {
      const nextArt = getNextARTNumber(artNumbers, selectedFacility);
      setArtNumber(nextArt.split("/")[3]);
    }
  }, [selectedFacility, artNumbers, transferIn]);

  useEffect(() => {
    if (selectedState) {
      setfacilitiesForSelectedState(facilities[0][selectedState]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedFacility && artNumber) {
      const combined = `${selectedFacility}${artNumber}`;
      setCombinedValue(combined);
      changeART(combined, contextArt.identifierUuid);
    } else {
      setCombinedValue("");
    }
  }, [selectedFacility, artNumber]);

  return (
    <div>
      <div id="patientIdentifier">
        <h6
          className={styles.productiveHeading01}
          style={{ color: "#161616", marginTop: "1rem" }}
        >
          {t("uniqueArtNumber", "Unique ART Number")}
        </h6>
        <div>
          {isLoading || !identifierTypes ? (
            <SkeletonPlaceholder className={styles.skeleton} />
          ) : (
            <>
              <Tile className={styles.wrapper}>
                <Checkbox
                  checked={transferIn}
                  value={transferIn}
                  onChange={() => setTransferIn((prev) => !prev)}
                  labelText="Transfer In"
                  id="transfer"
                />
              </Tile>
              <Tile className={styles.wrapper}>
                <Layer>
                  <Select
                    disabled={!transferIn && !inEditMode}
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
                    disabled={!transferIn && !inEditMode}
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
                    id="artNumber"
                    name="artNumber"
                    labelText={t("number", "Number")}
                    light={true}
                    required={true}
                    disabled={!transferIn && !inEditMode}
                  />
                </Layer>
              </Tile>
            </>
          )}
        </div>
        <div>ART Number: {combinedValue}</div>
      </div>
    </div>
  );
};
