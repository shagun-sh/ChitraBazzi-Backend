const db = require("../config/db");

// Get all products
const getAllProducts = (req, res) => {
  const sql = "SELECT * FROM Product";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(result);
  });
};
// Add Product
const addProduct = (req, res) => {
  const {
    category_id,
    product_name,
    description,
    price,
    stock_quantity,
    badge,
    image_url,
  } = req.body;

  const sql = `
    INSERT INTO Product
    (category_id, product_name, description, price, stock_quantity, badge, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      category_id,
      product_name,
      description,
      price,
      stock_quantity,
      badge,
      image_url,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(201).json({
        message: "Product added successfully",
        productId: result.insertId,
      });
    }
  );
};
const updateProduct = (req, res) => {
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

  const sql = `
    UPDATE Product
    SET category_id = ?,
        product_name = ?,
        description = ?,
        price = ?,
        stock_quantity = ?,
        badge = ?,
        image_url = ?
    WHERE product_id = ?
  `;

  db.query(
    sql,
    [
      category_id,
      product_name,
      description,
      price,
      stock_quantity,
      badge,
      image_url,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    }
  );
};
const deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Product WHERE product_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  });
};
const getProductById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Product WHERE product_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result[0]);
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};