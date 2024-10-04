import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FamilyHistory from "./family-members.component";
import axios from "axios";

jest.mock("axios");

describe("FamilyHistory component", () => {
	const mockResponse = {
    data: {
      results: [
        { display: 'General Family Information: Details about family history' },
        { display: 'Father: Hypertension' },
        { display: 'Mother: Diabetes' },
        { display: 'General Family Information: Additional Information' },
      ],
    },
  };

	beforeEach(() => {
		(axios.get as jest.Mock).mockResolvedValue(mockResponse);

		Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/patient/123e4567-e89b-12d3-a456-426614174000/',
      },
      writable: true,
    });
	})

	afterEach(() => {
    jest.clearAllMocks();
  });

	it('fetches observation data when the UUID is set', async () => {
		render(<FamilyHistory code="code123" patientUuid="123-3252" />);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(1);
		})
		expect(axios.get).toHaveBeenCalledWith(
      '/openmrs/ws/rest/v1/obs?patient=123e4567-e89b-12d3-a456-426614174000&_sort=-date&limit=100'
    );
	})
})