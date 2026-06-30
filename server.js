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
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChitraBazzi Backend Running 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});