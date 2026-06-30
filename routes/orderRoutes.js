const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/status", verifyToken, updateOrderStatus);

module.exports = router;