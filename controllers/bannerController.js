const db = require("../config/db");

// Get All Banners
const getAllBanners = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT *
      FROM Banner
      ORDER BY created_at DESC
    `);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add Banner
const addBanner = async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Banner image is required",
      });
    }

    const image_url = req.file.path;

    const [result] = await db.query(
      `
      INSERT INTO Banner
      (title, subtitle, image_url)
      VALUES (?, ?, ?)
      `,
      [title, subtitle, image_url]
    );

    res.status(201).json({
      message: "Banner uploaded successfully",
      banner_id: result.insertId,
      image_url,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Banner WHERE banner_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllBanners,
  addBanner,
  deleteBanner,
};