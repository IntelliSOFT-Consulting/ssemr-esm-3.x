import React, { useState } from "react";
import styles from "../field.scss";
import { Input } from "../../input/basic-input/input/input.component";
import { SelectInput } from "../../input/basic-input/select/select-input.component";
import { useTranslation } from "react-i18next";
import { countryCodes } from "./country-codes";
import { FormValues } from "../../patient-registration.types";
import { PatientRegistrationContext } from "../../patient-registration-context";

interface InputProps {
  id: string;
  name: string;
  labelText: string;
  light: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const PhoneField: React.FC<InputProps> = () => {
  const { values } = React.useContext(PatientRegistrationContext);
  const { t } = useTranslation();

  const [countryCode, setCountryCode] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [altCountryCode, setAltCountryCode] = useState("");
  const [altPhoneValue, setAltPhoneValue] = useState("");

  const handleCountryCodeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedCountryCode = event.target.value;
    setCountryCode(selectedCountryCode);
    setPhoneValue(selectedCountryCode);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValue(event.target.value);
  };

  const handleAltCountryCodeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedCountryCode = event.target.value;
    setAltCountryCode(selectedCountryCode);
    setAltPhoneValue(selectedCountryCode);
  };

  const handleAltPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(phoneValue);
    console.log(altPhoneValue);
  };

  return (
    <div className={styles.phoneFieldContainer}>
      <div className={styles.fieldRow}>
        <div className={styles.countryCode}>
          <SelectInput
            name="mobileCountryCode"
            options={countryCodes.map((code) => code.dial_code)}
            label={t("countryCode", "Country Code")}
            onChange={handleCountryCodeChange}
            value={""}
          />
        </div>
        <div className={styles.fieldColumn}>
          <Input
            id="phone"
            name="TelephoneNumber"
            labelText={t(
              "phoneNumberInputLabelText",
              "Clients Telephone Number",
            )}
            light={true}
            value={phoneValue}
            onChange={handlePhoneChange}
          />
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.countryCode}>
          <SelectInput
            name="alternativeMobileCountryCode"
            options={countryCodes.map((code) => code.dial_code)}
            label={t("countryCode", "Country Code")}
            onChange={handleAltCountryCodeChange}
            value={""}
          />
        </div>
        <div className={styles.fieldColumn}>
          <Input
            id="altPhone"
            name="alternativeTelephonePhone"
            labelText={t(
              "phoneNumberInputLabelText",
              "Alternative Telephone Number",
            )}
            light={true}
            value={altPhoneValue}
            onChange={handleAltPhoneChange}
          />
        </div>
      </div>
    </div>
  );
};
