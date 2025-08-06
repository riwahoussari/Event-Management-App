require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const categoriesRoutes = require("./routes/categories");
const eventsRoutes = require("./routes/events");
const { swaggerUi, swaggerSpec } = require("./swagger");

// Server Setup
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth Routes
app.use("/api/auth", authRoutes);

// Categories Routes
app.use("/api/categories", categoriesRoutes);

// Events Routes
app.use("/api/events", eventsRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
