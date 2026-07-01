const db = require("../config/db");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM Newsletter_Subscribers WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed"
      });
    }

    await db.query(
      "INSERT INTO Newsletter_Subscribers (email) VALUES (?)",
      [email]
    );

    res.status(201).json({
      success: true,
      message: "Subscribed successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};