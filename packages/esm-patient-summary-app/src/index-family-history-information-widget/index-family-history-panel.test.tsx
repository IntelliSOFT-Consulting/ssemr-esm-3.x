import React from "react";
import { render, screen } from "@testing-library/react";
import ClientFamilyInfoPanel from "./index-family-history-panel.component";
import IndexFamilyInfo from "../index-family-history-information/index-family-info.component";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn().mockReturnValue({ t: (key: string) => key }),
}));

jest.mock("../index-family-history-information/index-family-info.component", () => {
  return jest.fn(() => <div>Mocked IndexFamilyInfo</div>);
});

describe("IndexFamilyInfo component", () => {
	const patientUuid = "test-patient-uuid";

	test("renders without crashing", () => {
    const { getByText } = render(
      <ClientFamilyInfoPanel patientUuid={patientUuid} formEntrySub={null} />
    );

    expect(getByText("Mocked IndexFamilyInfo")).toBeInTheDocument();
  });

	test("renders IndexFamilyInfo with the correct props", () => {
    render(<ClientFamilyInfoPanel patientUuid={patientUuid} formEntrySub={null} />);

    expect(IndexFamilyInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        patientUuid: patientUuid,
        code: "",
      }),
      {}
    );
  });
})