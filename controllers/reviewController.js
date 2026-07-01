const db = require("../config/db");

// Get All Reviews
const getAllReviews = (req, res) => {
  const sql = `
    SELECT *
    FROM Reviews
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(result);
  });
};

// Get Review By ID
const getReviewById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM Reviews
    WHERE review_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json(result[0]);
  });
};

// Update Review Status
const updateReviewStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = `
    UPDATE Reviews
    SET status = ?
    WHERE review_id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review status updated successfully",
    });
  });
};

// Delete Review
const deleteReview = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM Reviews
    WHERE review_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  });
};

module.exports = {
  getAllReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
};