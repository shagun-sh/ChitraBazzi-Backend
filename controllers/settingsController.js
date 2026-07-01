const db = require("../config/db");

// Get Settings (Admin & Website)
const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Settings LIMIT 1"
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Settings
const updateSettings = async (req, res) => {
  try {
    const {
      website_name,
      email,
      phone,
      address,
      instagram,
      facebook,
      whatsapp,
      about_us,
      privacy_policy,
      terms_conditions,
    } = req.body;

    let logo_url = null;

    if (req.file) {
      logo_url = req.file.path;
    }

    const [existing] = await db.query(
      "SELECT logo_url FROM Settings WHERE setting_id=1"
    );

    if (!logo_url) {
      logo_url = existing[0].logo_url;
    }

    await db.query(
      `
      UPDATE Settings
      SET
      website_name=?,
      logo_url=?,
      email=?,
      phone=?,
      address=?,
      instagram=?,
      facebook=?,
      whatsapp=?,
      about_us=?,
      privacy_policy=?,
      terms_conditions=?
      WHERE setting_id=1
    `,
      [
        website_name,
        logo_url,
        email,
        phone,
        address,
        instagram,
        facebook,
        whatsapp,
        about_us,
        privacy_policy,
        terms_conditions,
      ]
    );

    res.json({
      message: "Settings updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};