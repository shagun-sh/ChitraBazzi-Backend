const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getAllReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", verifyToken, getAllReviews);

router.get("/:id", verifyToken, getReviewById);

router.put("/:id/status", verifyToken, updateReviewStatus);

router.delete("/:id", verifyToken, deleteReview);

module.exports = router;