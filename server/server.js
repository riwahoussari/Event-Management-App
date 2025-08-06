require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const db = require("./db/db-connection");
const cookieParser = require("cookie-parser")

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // allow requests from this origin
  credentials: true, // allow cookies / credentials if needed
}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
