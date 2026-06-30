require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Database Connection
require("./config/db");

// Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
<<<<<<< HEAD
const wishlistRoutes = require("./routes/wishlistRoutes");

=======
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
>>>>>>> 483f42e9969c09a50664da6b06838699cbe72a4d
// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin", adminRoutes);
app.use("/orders", orderRoutes);
<<<<<<< HEAD
app.use("/wishlist", wishlistRoutes);
=======
app.use("/dashboard", dashboardRoutes);
app.use("/customers", customerRoutes);
>>>>>>> 483f42e9969c09a50664da6b06838699cbe72a4d

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChitraBazzi Backend Running 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});