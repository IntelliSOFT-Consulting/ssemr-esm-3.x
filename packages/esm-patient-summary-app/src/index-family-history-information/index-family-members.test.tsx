import React from "react";
import { render } from "@testing-library/react";
import axios from "axios";
import IndexFamilyHistory from "./index-family-members.component";

jest.mock("axios");

describe("IndexFamilyHistory component", () => {
	const mockData = {
    data: {
      results: [
        { display: "General Family Information: Diabetes, Hypertension" },
        { display: "Diabetes: Controlled" },
        { display: "Hypertension: Mild" },
      ],
    },
  };

	beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue(mockData);
    Object.defineProperty(window, 'location', {
      value: {
        href: "http://localhost/patient/1234abcd-1234-1234-1234-1234abcd1234/",
      },
      writable: true,
    });
  });

	it("updates the patient UUID based on URL", () => {
    render(<IndexFamilyHistory code="testCode" patientUuid="1234" />);

    expect(window.location.href).toContain("/patient/1234abcd-1234-1234-1234-1234abcd1234/");
  });
})