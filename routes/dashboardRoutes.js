const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { getDashboard } = require("../controllers/dashboardController");

router.get("/", verifyToken, getDashboard);

module.exports = router;