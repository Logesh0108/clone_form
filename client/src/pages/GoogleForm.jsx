import { useState, useEffect,useRef } from "react";
import HeaderCard from "../components/HeaderCard";
import FormField from "../components/FormField";
import FileUpload from "../components/FileUpload";
import Footer from "../components/Footer";
import { submitForm } from "../services/formService";
import { useNavigate } from "react-router-dom";





function GoogleForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    aadhaarNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    phoneNumber: "",
    currentAddress: "",
    permanentAddress: "",
    email: "",
  });

  
  const [files, setFiles] = useState({
    aadhaarFile: null,
    panFile: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
  if (localStorage.getItem("formSubmitted")) {
    navigate("/submitted");
  }
}, [navigate]);

  const handleFileChange = (name, file) => {
    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });

  data.append("aadhaarFile", files.aadhaarFile);
  data.append("panFile", files.panFile);

  try {
    const res = await submitForm(data);

    if (res.data.success) {

      setFormData({
        fullName: "",
        fatherName: "",
        aadhaarNumber: "",
        panNumber: "",
        bankAccountNumber: "",
        accountHolderName: "",
        ifscCode: "",
        phoneNumber: "",
        currentAddress: "",
        permanentAddress: "",
        email: "",
      });

      setFiles({
        aadhaarFile: null,
        panFile: null,
      });

      // Save submission status
      localStorage.setItem("formSubmitted", "true");

      // Redirect to success page
      navigate("/submitted");
    }
  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      "Something went wrong"
    );
  }
};

const clearForm = () => {
  setFormData({
    fullName: "",
    fatherName: "",
    aadhaarNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    phoneNumber: "",
    currentAddress: "",
    permanentAddress: "",
    email: "",
  });

  setFiles({
    aadhaarFile: null,
    panFile: null,
  });
};

  return (
    <form
      className="container"
      onSubmit={handleSubmit}
    >
      <HeaderCard />

      <FormField
        label="Full Name as mentioned PAN / Aadhaar Card"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <FormField
        label="Father Name"
        name="fatherName"
        value={formData.fatherName}
        onChange={handleChange}
        required
      />

      <FormField
        label="Aadhaar Number"
        name="aadhaarNumber"
        value={formData.aadhaarNumber}
        onChange={handleChange}
        required
      />

      <FileUpload
        label="Upload Aadhaar Card"
        name="aadhaarFile"
        onFileChange={handleFileChange}
      />

      <FormField
        label="PAN Number"
        name="panNumber"
        value={formData.panNumber}
        onChange={handleChange}
        required
      />

      <FileUpload
        label="Upload PAN Card"
        name="panFile"
        onFileChange={handleFileChange}
      />

      <FormField
        label="Bank Account Number"
        name="bankAccountNumber"
        value={formData.bankAccountNumber}
        onChange={handleChange}
        required
      />

      <FormField
        label="Account Holder Name"
        name="accountHolderName"
        value={formData.accountHolderName}
        onChange={handleChange}
        required
      />

      <FormField
        label="IFSC Code"
        name="ifscCode"
        value={formData.ifscCode}
        onChange={handleChange}
        required
      />

      <FormField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />

      <FormField
        label="Current Address"
        name="currentAddress"
        value={formData.currentAddress}
        onChange={handleChange}
        required
      />

      <FormField
        label="Permanent Address"
        name="permanentAddress"
        value={formData.permanentAddress}
        onChange={handleChange}
        required
      />

      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn"
        >
          Submit
        </button>

        <button
          type="button"
          className="clear-form-btn"
          onClick={clearForm}
        >
          Clear Form
        </button>
      </div>

      <Footer />
    </form>
  );
}

export default GoogleForm;