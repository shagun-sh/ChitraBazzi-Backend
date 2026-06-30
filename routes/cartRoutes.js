const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, cartController.getCart);
router.post("/", verifyToken, cartController.addToCart);
router.put("/:id", verifyToken, cartController.updateCartItem);
router.delete("/:id", verifyToken, cartController.deleteCartItem);

module.exports = router;