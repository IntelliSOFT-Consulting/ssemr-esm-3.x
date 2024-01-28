import React from "react";
import { render } from "@testing-library/react";
import { useConfig } from "@openmrs/esm-framework";
import HIVArtDashboard from "./hiv-art-dashboard.component";

const testProps = { patientUuid: "testUuid" };

jest.mock("@openmrs/esm-framework", () => ({
  ...jest.requireActual("@openmrs/esm-framework"),
  useConfig: jest.fn(),
}));

describe("HIV Art Dashboard", () => {
  test("should render", () => {
    renderHIVArtDashboard();
  });
});

const renderHIVArtDashboard = () => {
  (useConfig as jest.Mock).mockReturnValue({
    cd4ViralLoadConcepts: ["cd4", "viralLoad"],
  });
  render(<HIVArtDashboard patientUuid={testProps.patientUuid} />);
};
