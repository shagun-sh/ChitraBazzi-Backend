const db = require("../config/db");

// Get All Coupons
const getAllCoupons = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Coupon ORDER BY created_at DESC"
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Coupon
const addCoupon = async (req, res) => {
  try {
    const {
      coupon_code,
      discount_percentage,
      min_order_amount,
      expiry_date,
      status,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO Coupon
      (coupon_code, discount_percentage, min_order_amount, expiry_date, status)
      VALUES (?, ?, ?, ?, ?)`,
      [
        coupon_code,
        discount_percentage,
        min_order_amount,
        expiry_date,
        status,
      ]
    );

    res.status(201).json({
      message: "Coupon added successfully",
      coupon_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      coupon_code,
      discount_percentage,
      min_order_amount,
      expiry_date,
      status,
    } = req.body;

    const [result] = await db.query(
      `UPDATE Coupon
      SET coupon_code=?,
          discount_percentage=?,
          min_order_amount=?,
          expiry_date=?,
          status=?
      WHERE coupon_id=?`,
      [
        coupon_code,
        discount_percentage,
        min_order_amount,
        expiry_date,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    res.json({
      message: "Coupon updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Coupon WHERE coupon_id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    res.json({
      message: "Coupon deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
};