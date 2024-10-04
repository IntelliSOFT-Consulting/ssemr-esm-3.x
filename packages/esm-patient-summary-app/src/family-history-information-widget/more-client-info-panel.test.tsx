import React from "react";
import { render, screen } from "@testing-library/react";
import ClientFamilyInfoPanel from "./more-client-info-panel.component";
import ClientInfo from "../family-history-information/more-client-info.component";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../family-history-information/more-client-info.component", () => () => (
  <div data-testid="client-info">Client Info Component</div>
));

describe("ClientFamilyInfoPanel component", () => {
	it("renders without crashing", () => {
    render(<ClientFamilyInfoPanel patientUuid="1234" formEntrySub={null} />);
    expect(screen.getByTestId("client-info")).toBeInTheDocument();
  });

	it("passes the correct props to ClientInfo", () => {
    const patientUuid = "1234";
    render(<ClientFamilyInfoPanel patientUuid={patientUuid} formEntrySub={null} />);
    const clientInfoComponent = screen.getByTestId("client-info");

    expect(clientInfoComponent).toBeInTheDocument();
    expect(clientInfoComponent).toHaveTextContent("Client Info Component");
  });
})