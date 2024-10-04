import React from "react";
import { render, screen } from "@testing-library/react";
import CommunityLinkagePanel from "./community-linkage-panel.component";
import CommunityLinkage from "../community-programme/community-linkage.component";
import { useTranslation } from "react-i18next";

jest.mock("../community-programme/community-linkage.component", () => jest.fn(() => <div>CommunityLinkage</div>));
jest.mock("@openmrs/esm-patient-common-lib", () => ({
  CardHeader: jest.fn(({ title }) => <div>{title}</div>),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("CommunityLinkagePanel component", () => {
	const patientUuid = "1234-5678-91011";

  beforeEach(() => {
    jest.clearAllMocks();
  });

	it('should render without crashing', () => {
		render(<CommunityLinkagePanel patientUuid={patientUuid} formEntrySub={null} />);

		expect(screen.getByText("linkageToCommunityWorker")).toBeInTheDocument();
	})

	it('should pass the correct props to the CommunityLinkage component', () => {
		render(<CommunityLinkagePanel patientUuid={patientUuid} formEntrySub={null} />);

		expect(CommunityLinkage).toHaveBeenCalledWith(
			expect.objectContaining({
				patientUuid: patientUuid,
				code: "",
			}),
			{}
		);
	})
})