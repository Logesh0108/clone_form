const request = require("supertest");
const app = require("../server");
const Form = require("../models/Form");
const fs = require("fs");

// Mock Form model
jest.mock("../models/Form", () => {
  const mockFindChain = {
    sort: jest.fn().mockImplementation(function() {
      return this;
    }),
    then: jest.fn(),
  };
  
  return {
    create: jest.fn(),
    find: jest.fn(() => mockFindChain),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
});

// Mock fs methods
jest.mock("fs", () => {
  const actualFs = jest.requireActual("fs");
  return {
    ...actualFs,
    existsSync: jest.fn(() => true),
    unlinkSync: jest.fn(),
  };
});

describe("Form API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/forms", () => {
    const mockFormData = {
      fullName: "JOHN DOE",
      fatherName: "SMITH DOE",
      aadhaarNumber: "123456789012",
      panNumber: "ABCDE1234F",
      bankAccountNumber: "98765432101",
      accountHolderName: "JOHN DOE",
      ifscCode: "SBIN0001234",
      phoneNumber: "9876543210",
      currentAddress: "123 Current St",
      permanentAddress: "456 Permanent Rd",
      email: "john@example.com",
    };

    it("should successfully submit form with valid fields and files", async () => {
      const mockSavedForm = {
        _id: "form_id_123",
        ...mockFormData,
        aadhaarFile: "uploads/aadhaar/mock-aadhaar.pdf",
        panFile: "uploads/pan/mock-pan.jpg",
      };

      Form.create.mockResolvedValue(mockSavedForm);

      const response = await request(app)
        .post("/api/forms")
        .field(mockFormData)
        .attach("aadhaarFile", Buffer.from("aadhaar pdf content"), "aadhaar.pdf")
        .attach("panFile", Buffer.from("pan image content"), "pan.jpg");

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Form submitted successfully.");
      expect(response.body.data).toEqual(mockSavedForm);
      expect(Form.create).toHaveBeenCalled();
    });

    it("should return 400 and delete uploaded files if required fields are missing", async () => {
      const incompleteData = { ...mockFormData };
      delete incompleteData.fullName; // missing required field

      const response = await request(app)
        .post("/api/forms")
        .field(incompleteData)
        .attach("aadhaarFile", Buffer.from("aadhaar pdf content"), "aadhaar.pdf")
        .attach("panFile", Buffer.from("pan image content"), "pan.jpg");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("All fields are required");
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(Form.create).not.toHaveBeenCalled();
    });

    it("should return 400 and delete files if file attachments are missing", async () => {
      const response = await request(app)
        .post("/api/forms")
        .field(mockFormData)
        .attach("aadhaarFile", Buffer.from("aadhaar pdf content"), "aadhaar.pdf");
        // missing panFile

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Both files are required");
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(Form.create).not.toHaveBeenCalled();
    });

    it("should return 400 and delete files if database save / validation fails", async () => {
      const dbError = new Error("Validation failed: Email address is invalid");
      Form.create.mockRejectedValue(dbError);

      const response = await request(app)
        .post("/api/forms")
        .field(mockFormData)
        .attach("aadhaarFile", Buffer.from("aadhaar pdf content"), "aadhaar.pdf")
        .attach("panFile", Buffer.from("pan image content"), "pan.jpg");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(dbError.message);
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });

  describe("GET /api/forms", () => {
    it("should return list of all forms", async () => {
      const mockForms = [
        { _id: "1", fullName: "Alice" },
        { _id: "2", fullName: "Bob" },
      ];
      
      const mockFindChain = {
        sort: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return Promise.resolve(callback(mockForms));
        }),
      };
      Form.find.mockReturnValue(mockFindChain);

      const response = await request(app).get("/api/forms");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toEqual(mockForms);
    });
  });

  describe("GET /api/forms/:id", () => {
    it("should return form if found", async () => {
      const mockForm = { _id: "form_123", fullName: "Alice" };
      Form.findById.mockResolvedValue(mockForm);

      const response = await request(app).get("/api/forms/form_123");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockForm);
    });

    it("should return 404 if form not found", async () => {
      Form.findById.mockResolvedValue(null);

      const response = await request(app).get("/api/forms/unknown_id");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Form not found.");
    });
  });

  describe("PUT /api/forms/:id", () => {
    it("should update form and return 200", async () => {
      const mockUpdatedForm = { _id: "form_123", fullName: "Alice Updated", panNumber: "ABCDE1234F" };
      Form.findByIdAndUpdate.mockResolvedValue(mockUpdatedForm);

      const response = await request(app)
        .put("/api/forms/form_123")
        .send({ fullName: "Alice Updated", panNumber: "abcde1234f" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Form updated successfully.");
      expect(response.body.data).toEqual(mockUpdatedForm);
      expect(Form.findByIdAndUpdate).toHaveBeenCalledWith(
        "form_123",
        expect.objectContaining({ fullName: "Alice Updated", panNumber: "ABCDE1234F" }),
        expect.any(Object)
      );
    });

    it("should return 404 if form to update is not found", async () => {
      Form.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/forms/unknown_id")
        .send({ fullName: "Alice Updated" });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/forms/:id", () => {
    it("should delete form, clean up its files from disk, and return 200", async () => {
      const mockForm = {
        _id: "form_123",
        fullName: "Alice",
        aadhaarFile: "uploads/aadhaar/alice-aadhaar.pdf",
        panFile: "uploads/pan/alice-pan.jpg",
      };

      Form.findById.mockResolvedValue(mockForm);
      Form.findByIdAndDelete.mockResolvedValue(mockForm);

      const response = await request(app).delete("/api/forms/form_123");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Form deleted successfully.");
      expect(fs.unlinkSync).toHaveBeenCalledWith("uploads/aadhaar/alice-aadhaar.pdf");
      expect(fs.unlinkSync).toHaveBeenCalledWith("uploads/pan/alice-pan.jpg");
      expect(Form.findByIdAndDelete).toHaveBeenCalledWith("form_123");
    });

    it("should return 404 if form to delete is not found", async () => {
      Form.findById.mockResolvedValue(null);

      const response = await request(app).delete("/api/forms/unknown_id");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(Form.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
