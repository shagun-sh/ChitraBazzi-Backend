const db = require("../config/db");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM Product");

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Product By ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "SELECT * FROM Product WHERE product_id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      category_id,
      product_name,
      description,
      price,
      stock_quantity,
      badge,
      image_url,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO Product
      (category_id, product_name, description, price, stock_quantity, badge, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category_id,
        product_name,
        description,
        price,
        stock_quantity,
        badge,
        image_url,
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      product_name,
      description,
      price,
      stock_quantity,
      badge,
      image_url,
    } = req.body;

    const [result] = await db.query(
      `
      UPDATE Product
      SET category_id = ?,
          product_name = ?,
          description = ?,
          price = ?,
          stock_quantity = ?,
          badge = ?,
          image_url = ?
      WHERE product_id = ?
      `,
      [
        category_id,
        product_name,
        description,
        price,
        stock_quantity,
        badge,
        image_url,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Product WHERE product_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};