const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
} = require("../controllers/formController");

router.post(
  "/",
  upload.fields([
    {
      name: "aadhaarFile",
      maxCount: 1,
    },
    {
      name: "panFile",
      maxCount: 1,
    },
  ]),
  createForm
);
module.exports = router;