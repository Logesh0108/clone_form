const Form = require("../models/Form");
const fs = require("fs");

const cleanupFiles = (req) => {
  if (req.files) {
    if (req.files.aadhaarFile && req.files.aadhaarFile[0]) {
      const filePath = req.files.aadhaarFile[0].path;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete aadhaarFile:", e);
        }
      }
    }
    if (req.files.panFile && req.files.panFile[0]) {
      const filePath = req.files.panFile[0].path;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete panFile:", e);
        }
      }
    }
  }
};

const createForm = async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      aadhaarNumber,
      panNumber,
      bankAccountNumber,
      accountHolderName,
      ifscCode,
      phoneNumber,
      currentAddress,
      permanentAddress,
      email,
    } = req.body;

    if (
      !fullName ||
      !fatherName ||
      !aadhaarNumber ||
      !panNumber ||
      !bankAccountNumber ||
      !accountHolderName ||
      !ifscCode ||
      !phoneNumber ||
      !currentAddress ||
      !permanentAddress ||
      !email
    ) {
      cleanupFiles(req);
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const aadhaarFile = req.files?.aadhaarFile
      ? req.files.aadhaarFile[0].path
      : "";

    const panFile = req.files?.panFile
      ? req.files.panFile[0].path
      : "";

    if (!aadhaarFile || !panFile) {
      cleanupFiles(req);
      return res.status(400).json({
        success: false,
        message: "Both files are required.",
      });
    }

    // Mongoose schema will also uppercase them, but let's be safe
    const form = await Form.create({
      fullName,
      fatherName,
      aadhaarNumber,
      aadhaarFile,
      panNumber: panNumber.toUpperCase(),
      panFile,
      bankAccountNumber,
      accountHolderName,
      ifscCode: ifscCode.toUpperCase(),
      phoneNumber,
      currentAddress,
      permanentAddress,
      email,
    });

    console.log("Saved Form:", form);

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully.",
      data: form,
    });
  } catch (error) {
    cleanupFiles(req);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateForm = async (req, res) => {
  try {
    // Standardize casing of fields if provided
    const updateData = { ...req.body };
    if (updateData.panNumber) {
      updateData.panNumber = updateData.panNumber.toUpperCase();
    }
    if (updateData.ifscCode) {
      updateData.ifscCode = updateData.ifscCode.toUpperCase();
    }

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form updated successfully.",
      data: form,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    // Delete files first
    if (form.aadhaarFile && fs.existsSync(form.aadhaarFile)) {
      try {
        fs.unlinkSync(form.aadhaarFile);
      } catch (e) {
        console.error("Failed to delete Aadhaar file on disk:", e);
      }
    }
    if (form.panFile && fs.existsSync(form.panFile)) {
      try {
        fs.unlinkSync(form.panFile);
      } catch (e) {
        console.error("Failed to delete PAN file on disk:", e);
      }
    }

    await Form.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Form deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
};