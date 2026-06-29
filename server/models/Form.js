const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      required: [true, "Aadhaar number is required"],
      trim: true,
      match: [/^\d{12}$/, "Aadhaar number must be exactly 12 digits"],
    },

    aadhaarFile: {
      type: String,
      required: [true, "Aadhaar file is required"],
    },

    panNumber: {
      type: String,
      required: [true, "PAN number is required"],
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN number must be a valid Indian PAN format (e.g. ABCDE1234F)"],
    },

    panFile: {
      type: String,
      required: [true, "PAN file is required"],
    },

    bankAccountNumber: {
      type: String,
      required: [true, "Bank account number is required"],
      trim: true,
      match: [/^\d{9,18}$/, "Bank account number must be between 9 and 18 digits"],
    },

    accountHolderName: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
    },

    ifscCode: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "IFSC code must be a valid 11-digit Indian IFSC format (e.g. SBIN0001234)"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit number starting with 6-9"],
    },

    currentAddress: {
      type: String,
      required: [true, "Current address is required"],
      trim: true,
    },

    permanentAddress: {
      type: String,
      required: [true, "Permanent address is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Form", formSchema);