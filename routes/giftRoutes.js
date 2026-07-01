const express = require("express");
const router = express.Router();

const giftController = require("../controllers/giftController");

router.post(
  "/request",
  giftController.createGiftRequest
);

module.exports = router;