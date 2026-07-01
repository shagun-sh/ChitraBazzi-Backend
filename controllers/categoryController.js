const db = require("../config/db");

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM Category");

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Category By ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "SELECT * FROM Category WHERE category_id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add Category
const addCategory = async (req, res) => {
  try {
    const { category_name, category_image } = req.body;

    const [result] = await db.query(
      "INSERT INTO Category (category_name, category_image) VALUES (?, ?)",
      [category_name, category_image]
    );

    res.status(201).json({
      message: "Category added successfully",
      categoryId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_image } = req.body;

    const [result] = await db.query(
      "UPDATE Category SET category_name = ?, category_image = ? WHERE category_id = ?",
      [category_name, category_image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Category WHERE category_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};