import React from "react";
import { Layer, Select, SelectItem } from "@carbon/react";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

interface SelectInputProps {
  name: string;
  options: Array<string>;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  required?: boolean;
  value: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  options,
  label,
  required,
  onChange,
}) => {
  const [field] = useField(name);
  const { t } = useTranslation();
  // const selectOptions = [
  //   <SelectItem disabled hidden text={`Select ${label}`} key="" value="" />,
  //   options?.map((currentOption, index) => (
  //     <SelectItem text={currentOption} value={currentOption} key={index} />
  //   )),
  // ];

  const labelText = required
    ? label
    : `${label} (${t("optional", "optional")})`;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Layer>
        <Select
          onChange={onChange}
          id="identifier"
          {...field}
          labelText={labelText}
        >
          <SelectItem disabled hidden text={`Select ${label}`} value="" />
          {options?.map((option, index) => (
            <SelectItem text={option} value={option} key={index} />
          ))}
        </Select>
      </Layer>
    </div>
  );
};
