const Form = require("../models/Form");

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
      return res.status(400).json({
        success: false,
        message: "Both files are required.",
      });
    }

const form = await Form.create({
  fullName,
  fatherName,
  aadhaarNumber,
  aadhaarFile,
  panNumber,
  panFile,
  bankAccountNumber,
  accountHolderName,
  ifscCode,
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
    return res.status(500).json({
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
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

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