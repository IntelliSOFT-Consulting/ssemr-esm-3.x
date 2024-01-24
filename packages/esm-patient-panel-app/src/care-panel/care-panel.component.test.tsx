import React from "react";
import { render, screen } from "@testing-library/react";
import CarePanel from "./care-panel.component";
import { mockComponent } from "react-dom/test-utils";
import { mockPatient } from "../../../../__mocks__/patient-summary.mock";

jest.mock("../program-summary/program-summary.component", () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-program-summary" />,
}));

const mockPatientUuid = mockPatient.uuid;

jest.mock("@carbon/react", () => ({
  StructuredListSkeleton: () => (
    <div data-testid="mocked-structured-list-skeleton" />
  ),
  ContentSwitcher: ({ children }) => (
    <div data-testid="mocked-content-switcher">{children}</div>
  ),
  Switch: ({ text }) => <button>{text}</button>,
  InlineLoading: () => <div data-testid="mocked-inline-loading" />,
}));
