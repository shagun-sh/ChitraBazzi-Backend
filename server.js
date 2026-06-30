const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Database Connection
require("./config/db");

// Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});