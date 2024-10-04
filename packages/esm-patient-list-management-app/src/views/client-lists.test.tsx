import React from "react";
import { screen, render } from "@testing-library/react";
import ListsDashboard from "./client-lists.component";
import { usePatientListing } from "../hooks/usePatientListing";

jest.mock("../hooks/usePatientListing");

describe("Lists Dashboard", () => {
	beforeEach(() => {
		(usePatientListing as jest.Mock).mockReturnValue({
			tabs: [],
			currentTab: 0,
			tableHeaders: [],
			handleTabChange: jest.fn(),
			filterText: "",
			setFilterText: jest.fn(),
			resetPaginationToggle: false,
			setResetPaginationToggle: jest.fn(),
			loading: false,
			filteredTableData: [],
			currentPaginationState: {}
		})
	})

	it("component should render without failing", () => {
		render(<ListsDashboard />);
		const listsDashboard = screen.getByTestId("patient-list-dashboard");
		
		expect(listsDashboard).toBeInTheDocument();
	})

	it("data table should render without failing", () => {
		render(<ListsDashboard />);
		const dataTable = screen.getByTestId("patient-list-table");
		
		expect(dataTable).toBeInTheDocument();
	})

	it("if loading, it should show loading text", () => {
		// Mocking the loading state
		(usePatientListing as jest.Mock).mockReturnValue({
				tabs: [],
				currentTab: 0,
				tableHeaders: [],
				handleTabChange: jest.fn(),
				filterText: "",
				setFilterText: jest.fn(),
				resetPaginationToggle: false,
				setResetPaginationToggle: jest.fn(),
				loading: true,
				filteredTableData: [],
				currentPaginationState: {}
		})

		render(<ListsDashboard />)

		expect(screen.getByText(/Please wait as we fetch the clients/i)).toBeInTheDocument();
	})

	it("should show patient does not exist if searched record does not exist", () => {
		// Mocking the empty state
		(usePatientListing as jest.Mock).mockReturnValue({
				tabs: [],
				currentTab: 0,
				tableHeaders: [],
				handleTabChange: jest.fn(),
				filterText: "",
				setFilterText: jest.fn(),
				resetPaginationToggle: false,
				setResetPaginationToggle: jest.fn(),
				loading: false,
				filteredTableData: [],
				currentPaginationState: {}
		})

		render(<ListsDashboard />)

		expect(screen.getByText(/This patient does not exist in the system/i)).toBeInTheDocument();
	})
})