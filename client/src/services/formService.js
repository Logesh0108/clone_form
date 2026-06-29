import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/forms",
});

export const submitForm = async (formData) => {
  return API.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};