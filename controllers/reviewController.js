const db = require("../config/db");

// Get All Reviews
const getAllReviews = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT *
      FROM Reviews
      ORDER BY created_at DESC
    `);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Review By ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      SELECT *
      FROM Reviews
      WHERE review_id = ?
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Review Status
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await db.query(
      `
      UPDATE Reviews
      SET status = ?
      WHERE review_id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM Reviews
      WHERE review_id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
};