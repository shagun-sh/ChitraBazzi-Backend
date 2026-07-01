const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

const {
  getAllBanners,
  addBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.get("/", verifyToken, getAllBanners);

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  addBanner
);

router.delete("/:id", verifyToken, deleteBanner);

module.exports = router;