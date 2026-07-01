const db = require("../config/db");

// Add Product to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const [existing] = await db.query(
      "SELECT * FROM Wishlist WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Product already exists in wishlist",
      });
    }

    await db.query(
      "INSERT INTO Wishlist (user_id, product_id) VALUES (?, ?)",
      [user_id, product_id]
    );

    res.status(201).json({
      message: "Product added to wishlist successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get User Wishlist
const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [result] = await db.query(
      `
      SELECT
        w.wishlist_id,
        p.*
      FROM Wishlist w
      JOIN Product p
        ON w.product_id = p.product_id
      WHERE w.user_id = ?
      `,
      [user_id]
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Wishlist WHERE wishlist_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      message: "Product removed from wishlist successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};