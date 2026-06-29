const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");

const connectDB = require("./config/db");

dotenv.config();

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/forms", formRoutes);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;