const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);

module.exports = router;