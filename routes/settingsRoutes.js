const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

// Website
router.get("/", getSettings);

// Admin
router.get("/admin", verifyToken, getSettings);

router.put(
  "/admin",
  verifyToken,
  upload.single("logo"),
  updateSettings
);

module.exports = router;