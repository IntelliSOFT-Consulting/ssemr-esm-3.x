import React from "react";
import { render, screen } from "@testing-library/react";
import CommunityLinkage, { CommunityLinkageProps } from "./community-linkage.component";
import useObservationData from "../hooks/useObservationData";
import { useTranslation } from "react-i18next";

jest.mock("../hooks/useObservationData");
const mockedUseObservationData = useObservationData as jest.Mock;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("CommunityLinkage component", () => {
  const defaultProps: CommunityLinkageProps = {
    patientUuid: "1234",
    code: "testCode",
  };

	it('displays loading skeleton when component is loading', () => {
		mockedUseObservationData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

		render(<CommunityLinkage {...defaultProps} />);

		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	})

	it('renders null when no data is available', () => {
		mockedUseObservationData.mockReturnValue({
			data: null,
			isLoading: false,
			error: null,
		});

		const { container } = render(<CommunityLinkage {...defaultProps} />);

		expect(container.firstChild).toBeNull();
	})

	it('renders community linkage data correctly', () => {
		mockedUseObservationData.mockReturnValue({
      data: {
        results: [
          {
            chwName: "John Doe",
            chwPhone: "1234567890",
            chwAddress: "123 Main Street",
          },
        ],
      },
      isLoading: false,
      error: null,
    });

		render(<CommunityLinkage {...defaultProps} />);

		expect(screen.getByText("nameOfCHW")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("telephoneNumber")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("chwAddress")).toBeInTheDocument();
    expect(screen.getByText("123 Main Street")).toBeInTheDocument();
	})
})