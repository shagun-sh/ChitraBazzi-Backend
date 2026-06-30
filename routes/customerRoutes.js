const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getAllCustomers,
  getCustomerById,
} = require("../controllers/customerController");

router.get("/", verifyToken, getAllCustomers);

router.get("/:id", verifyToken, getCustomerById);

module.exports = router;