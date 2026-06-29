import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GoogleForm from "../GoogleForm";
import * as formService from "../../services/formService";

// Mock Navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock formService
vi.mock("../../services/formService", () => ({
  submitForm: vi.fn(),
}));

describe("GoogleForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <GoogleForm />
      </MemoryRouter>
    );
  };

  it("should render all form fields and action buttons", () => {
    renderComponent();

    // Check headings
    expect(screen.getByRole("heading", { name: /Interns Details : IBM/i })).toBeInTheDocument();

    // Check text input labels
    expect(screen.getByText(/Full Name as mentioned PAN \/ Aadhaar Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Father Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Aadhaar Number/i)).toBeInTheDocument();
    expect(screen.getByText(/PAN Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Bank Account Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Account Holder Name/i)).toBeInTheDocument();
    expect(screen.getByText(/IFSC Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Permanent Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();

    // Check file upload buttons
    expect(screen.getByText(/Upload Aadhaar Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload PAN Card/i)).toBeInTheDocument();

    // Check submit and clear buttons
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear Form/i })).toBeInTheDocument();
  });

  it("should update input fields on user input", () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/Full Name as mentioned PAN \/ Aadhaar Card/i);
    fireEvent.change(nameInput, { target: { value: "JOHN DOE" } });
    expect(nameInput.value).toBe("JOHN DOE");

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");
  });

  it("should clear all inputs when Clear Form button is clicked", () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/Full Name as mentioned PAN \/ Aadhaar Card/i);
    fireEvent.change(nameInput, { target: { value: "JOHN DOE" } });

    const clearBtn = screen.getByRole("button", { name: /Clear Form/i });
    fireEvent.click(clearBtn);

    expect(nameInput.value).toBe("");
  });

  it("should fail validation and not submit if files are missing", async () => {
    renderComponent();

    // Fill in text fields
    fireEvent.change(screen.getByLabelText(/Full Name as mentioned PAN \/ Aadhaar Card/i), { target: { value: "JOHN DOE" } });
    fireEvent.change(screen.getByLabelText(/Father Name/i), { target: { value: "SMITH DOE" } });
    fireEvent.change(screen.getByLabelText(/Aadhaar Number/i), { target: { value: "123456789012" } });
    fireEvent.change(screen.getByLabelText(/PAN Number/i), { target: { value: "ABCDE1234F" } });
    fireEvent.change(screen.getByLabelText(/Bank Account Number/i), { target: { value: "98765432101" } });
    fireEvent.change(screen.getByLabelText(/Account Holder Name/i), { target: { value: "JOHN DOE" } });
    fireEvent.change(screen.getByLabelText(/IFSC Code/i), { target: { value: "SBIN0001234" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/Current Address/i), { target: { value: "123 Current St" } });
    fireEvent.change(screen.getByLabelText(/Permanent Address/i), { target: { value: "456 Permanent Rd" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });

    // Submit form without uploading files
    const submitBtn = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitBtn);

    // Should display validation errors
    expect(screen.getAllByText(/This is a required question/i).length).toBe(2);
    expect(formService.submitForm).not.toHaveBeenCalled();
  });

  it("should navigate to /submitted on successful API response", async () => {
    formService.submitForm.mockResolvedValue({
      data: { success: true }
    });

    renderComponent();

    // Fill in text fields
    fireEvent.change(screen.getByLabelText(/Full Name as mentioned PAN \/ Aadhaar Card/i), { target: { value: "JOHN DOE" } });
    fireEvent.change(screen.getByLabelText(/Father Name/i), { target: { value: "SMITH DOE" } });
    fireEvent.change(screen.getByLabelText(/Aadhaar Number/i), { target: { value: "123456789012" } });
    fireEvent.change(screen.getByLabelText(/PAN Number/i), { target: { value: "ABCDE1234F" } });
    fireEvent.change(screen.getByLabelText(/Bank Account Number/i), { target: { value: "98765432101" } });
    fireEvent.change(screen.getByLabelText(/Account Holder Name/i), { target: { value: "JOHN DOE" } });
    fireEvent.change(screen.getByLabelText(/IFSC Code/i), { target: { value: "SBIN0001234" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/Current Address/i), { target: { value: "123 Current St" } });
    fireEvent.change(screen.getByLabelText(/Permanent Address/i), { target: { value: "456 Permanent Rd" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });

    // Mock file upload selections
    const fileInputs = document.querySelectorAll("input[type='file']");
    const mockFileAadhaar = new File(["aadhaar"], "aadhaar.pdf", { type: "application/pdf" });
    const mockFilePan = new File(["pan"], "pan.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInputs[0], { target: { files: [mockFileAadhaar] } });
    fireEvent.change(fileInputs[1], { target: { files: [mockFilePan] } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(formService.submitForm).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/submitted");
      expect(localStorage.getItem("formSubmitted")).toBe("true");
    });
  });
});
