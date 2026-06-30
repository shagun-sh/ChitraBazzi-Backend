const db = require("../config/db");

// Get All Categories
const getAllCategories = (req, res) => {
  const sql = "SELECT * FROM Category";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(result);
  });
};

// Add Category
const addCategory = (req, res) => {
  const { category_name, category_image } = req.body;

  const sql =
    "INSERT INTO Category (category_name, category_image) VALUES (?, ?)";

  db.query(sql, [category_name, category_image], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(201).json({
      message: "Category added successfully",
      categoryId: result.insertId,
    });
  });
};
const getCategoryById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Category WHERE category_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result[0]);
  });
};
const updateCategory = (req, res) => {
  const { id } = req.params;
  const { category_name, category_image } = req.body;

  const sql =
    "UPDATE Category SET category_name = ?, category_image = ? WHERE category_id = ?";

  db.query(sql, [category_name, category_image, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully" });
  });
};
const deleteCategory = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Category WHERE category_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  });
};


module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};