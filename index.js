const cookieParser = require('cookie-parser');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const jwtSecret = process.env.JWT_SECRET; 
if (!jwtSecret) {
  console.error("❌ JWT_SECRET is missing! Set it in the .env file.");
  process.exit(1); // Stop the server if the secret is missing
}


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/patient-records", require("./routes/patientRecordroutes"));
app.use("/api/search", require("./routes/searchRoutes"));

app.use("/api/logs", require("./routes/ActivityLogRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
