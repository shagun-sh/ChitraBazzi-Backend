const db = require("../config/db");

// Get All Banners
const getAllBanners = (req, res) => {
  const sql = `
    SELECT *
    FROM Banner
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json(result);
  });
};

// Add Banner
const addBanner = (req, res) => {
  const { title, subtitle } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message: "Banner image is required",
    });
  }

  const image_url = req.file.path;

  const sql = `
    INSERT INTO Banner
    (title, subtitle, image_url)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [title, subtitle, image_url],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Banner uploaded successfully",
        banner_id: result.insertId,
        image_url,
      });
    }
  );
};
// Delete Banner
const deleteBanner = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM Banner
    WHERE banner_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  });
};

module.exports = {
  getAllBanners,
  addBanner,
  deleteBanner,
};