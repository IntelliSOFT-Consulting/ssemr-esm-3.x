import React, { useCallback, useContext } from "react";
import classNames from "classnames";
import { Field, useField } from "formik";
import { useTranslation } from "react-i18next";
import {
  InlineNotification,
  Layer,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import { useConfig } from "@openmrs/esm-framework";
import { ConceptResponse } from "../../patient-registration.types";
import { FieldDefinition, RegistrationConfig } from "../../../config-schema";
import { Input } from "../../input/basic-input/input/input.component";
import { useConcept, useConceptAnswers } from "../field.resource";
import styles from "./../field.scss";
import { generateFormatting } from "../../date-util";
import { PatientRegistrationContext } from "../../patient-registration-context";

export interface ObsFieldProps {
  fieldDefinition: FieldDefinition;
}

export function ObsField({ fieldDefinition }: ObsFieldProps) {
  const { data: concept, isLoading } = useConcept(fieldDefinition.uuid);
  const config = useConfig() as RegistrationConfig;
  const [date, dateMeta] = useField("date");
  const { setFieldValue } = useContext(PatientRegistrationContext);

  const { format, dateFormat } = generateFormatting(["d", "m", "Y"], "/");

  if (!config.registrationObs.encounterTypeUuid) {
    console.error(
      "The registration form has been configured to have obs fields, " +
        "but no registration encounter type has been configured. Obs fields " +
        "will not be displayed."
    );
    return null;
  }

  if (isLoading) {
    return null;
  }
  switch (concept.datatype.display) {
    case "Text":
      return (
        <TextObsField
          concept={concept}
          validationRegex={fieldDefinition.validation.matches}
          label={fieldDefinition.label}
          required={fieldDefinition.validation.required}
        />
      );
    case "Numeric":
      return (
        <NumericObsField
          concept={concept}
          label={fieldDefinition.label}
          required={fieldDefinition.validation.required}
        />
      );
    case "Date":
      return (
        <DateObsField
          concept={concept}
          label={fieldDefinition.label}
          required={fieldDefinition.validation.required}
          dateFormat={dateFormat}
          date={date}
          dateMeta={dateMeta}
          setFieldValue={setFieldValue}
          format={format}
        />
      );
    case "Coded":
      return (
        <CodedObsField
          concept={concept}
          answerConceptSetUuid={fieldDefinition.answerConceptSetUuid}
          label={fieldDefinition.label}
          required={fieldDefinition.validation.required}
        />
      );
    default:
      return (
        <InlineNotification kind="error" title="Error">
          Concept has unknown datatype "{concept.datatype.display}"
        </InlineNotification>
      );
  }
}

interface TextObsFieldProps {
  concept: ConceptResponse;
  validationRegex: string;
  label: string;
  required?: boolean;
}

function TextObsField({
  concept,
  validationRegex,
  label,
  required,
}: TextObsFieldProps) {
  const { t } = useTranslation();

  const validateInput = (value: string) => {
    if (
      !value ||
      !validationRegex ||
      validationRegex === "" ||
      typeof validationRegex !== "string" ||
      value === ""
    ) {
      return;
    }
    const regex = new RegExp(validationRegex);
    if (regex.test(value)) {
      return;
    } else {
      return t("invalidInput", "Invalid Input");
    }
  };

  const fieldName = `obs.${concept.uuid}`;
  return (
    <div
      className={classNames(styles.customField, styles.halfWidthInDesktopView)}
    >
      <Field name={fieldName} validate={validateInput}>
        {({ field, form: { touched, errors }, meta }) => {
          return (
            <Input
              id={fieldName}
              labelText={label ?? concept.display}
              required={required}
              invalid={errors[fieldName] && touched[fieldName]}
              {...field}
            />
          );
        }}
      </Field>
    </div>
  );
}

interface DateObsFieldProps {
  concept: ConceptResponse;
  label: string;
  required?: boolean;
  dateFormat: string;
  date: any;
  dateMeta: any;
  setFieldValue: any;
  format: any;
}

function DateObsField({
  concept,
  label,
  required,
  dateFormat,
  date,
  dateMeta,
  setFieldValue,
  format,
}: DateObsFieldProps) {
  const { t } = useTranslation();
  const today = new Date();

  const onDateChange = useCallback(
    (selectedDate: Date) => {
      setFieldValue("date", selectedDate);
    },
    [setFieldValue]
  );

  const fieldName = `obs.${concept.uuid}`;
  return (
    <div
      className={classNames(styles.customField, styles.halfWidthInDesktopView)}
    >
      <Field name={fieldName}>
        {({ field, form: { touched, errors }, meta }) => {
          return (
            <DatePicker
              dateFormat={dateFormat}
              datePickerType="single"
              onChange={onDateChange}
              maxDate={format(today)}
            >
              <DatePickerInput
                id={fieldName}
                labelText={label ?? concept.display}
                required={required}
                invalid={errors[fieldName] && touched[fieldName]}
                invalidText={dateMeta.error && t(dateMeta.error)}
                value={format(date.value)}
                {...field}
              />
            </DatePicker>
          );
        }}
      </Field>
    </div>
  );
}

interface NumericObsFieldProps {
  concept: ConceptResponse;
  label: string;
  required?: boolean;
}

function NumericObsField({ concept, label, required }: NumericObsFieldProps) {
  const { t } = useTranslation();

  const fieldName = `obs.${concept.uuid}`;

  return (
    <div
      className={classNames(styles.customField, styles.halfWidthInDesktopView)}
    >
      <Field name={fieldName}>
        {({ field, form: { touched, errors }, meta }) => {
          return (
            <Input
              id={fieldName}
              labelText={label ?? concept.display}
              required={required}
              invalid={errors[fieldName] && touched[fieldName]}
              type="number"
              {...field}
            />
          );
        }}
      </Field>
    </div>
  );
}

interface CodedObsFieldProps {
  concept: ConceptResponse;
  answerConceptSetUuid?: string;
  label?: string;
  required?: boolean;
}

function CodedObsField({
  concept,
  answerConceptSetUuid,
  label,
  required,
}: CodedObsFieldProps) {
  const config = useConfig() as RegistrationConfig;
  const { data: conceptAnswers, isLoading: isLoadingConceptAnswers } =
    useConceptAnswers(answerConceptSetUuid ?? concept.uuid);

  const fieldName = `obs.${concept.uuid}`;
  const fieldDefinition = config?.fieldDefinitions?.filter(
    (def) => def.type === "obs" && def.uuid === concept.uuid
  )[0];

  return (
    <div
      className={classNames(styles.customField, styles.halfWidthInDesktopView)}
    >
      {!isLoadingConceptAnswers ? (
        <Field name={fieldName}>
          {({ field, form: { touched, errors }, meta }) => {
            if (fieldDefinition?.customConceptAnswers?.length) {
              return (
                <Layer>
                  <Select
                    id={fieldName}
                    name={fieldName}
                    required={required}
                    labelText={label ?? concept?.display}
                    invalid={errors[fieldName] && touched[fieldName]}
                    {...field}
                  >
                    <SelectItem
                      key={`no-answer-select-item-${fieldName}`}
                      value={""}
                      text=""
                    />
                    {fieldDefinition?.customConceptAnswers.map((answer) => (
                      <SelectItem
                        key={answer.uuid}
                        value={answer.uuid}
                        text={answer.label}
                      />
                    ))}
                  </Select>
                </Layer>
              );
            }
            return (
              <Layer>
                <Select
                  id={fieldName}
                  name={fieldName}
                  labelText={label ?? concept?.display}
                  required={required}
                  invalid={errors[fieldName] && touched[fieldName]}
                  {...field}
                >
                  <SelectItem
                    key={`no-answer-select-item-${fieldName}`}
                    value={""}
                    text=""
                  />
                  {conceptAnswers.map((answer) => (
                    <SelectItem
                      key={answer.uuid}
                      value={answer.uuid}
                      text={answer.display}
                    />
                  ))}
                </Select>
              </Layer>
            );
          }}
        </Field>
      ) : null}
    </div>
  );
}
