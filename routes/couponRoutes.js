const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

router.get("/", verifyToken, getAllCoupons);

router.post("/", verifyToken, addCoupon);

router.put("/:id", verifyToken, updateCoupon);

router.delete("/:id", verifyToken, deleteCoupon);

module.exports = router;