const db = require("../config/db");

exports.createGiftRequest = async (req, res) => {
  try {
    const {
      recipient_name,
      occasion,
      gift_type,
      custom_message
    } = req.body;

    if (
      !recipient_name ||
      !occasion ||
      !gift_type ||
      !custom_message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    await db.query(
      `INSERT INTO Personalized_Gift_Request
      (recipient_name, occasion, gift_type, custom_message)
      VALUES (?, ?, ?, ?)`,
      [
        recipient_name,
        occasion,
        gift_type,
        custom_message
      ]
    );

    res.status(201).json({
      success: true,
      message: "Gift request submitted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};