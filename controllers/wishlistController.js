const db = require("../config/db");

// Add Product to Wishlist
const addToWishlist = (req, res) => {
  const { user_id, product_id } = req.body;

  const checkSql =
    "SELECT * FROM Wishlist WHERE user_id = ? AND product_id = ?";

  db.query(checkSql, [user_id, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Product already exists in wishlist",
      });
    }

    const insertSql =
      "INSERT INTO Wishlist (user_id, product_id) VALUES (?, ?)";

    db.query(insertSql, [user_id, product_id], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Product added to wishlist successfully",
      });
    });
  });
};

// Get User Wishlist
const getWishlist = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT
      w.wishlist_id,
      p.*
    FROM Wishlist w
    JOIN Product p
      ON w.product_id = p.product_id
    WHERE w.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json(result);
  });
};

// Remove Product from Wishlist
const removeFromWishlist = (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM Wishlist WHERE wishlist_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      message: "Product removed from wishlist successfully",
    });
  });
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};