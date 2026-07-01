const db = require("../config/db");

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT
        o.order_id,
        u.full_name,
        u.email,
        o.order_date,
        o.total_amount,
        o.status
      FROM Orders o
      JOIN Users u
        ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Order By ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      SELECT
        o.order_id,
        o.order_date,
        o.total_amount,
        o.status,
        u.full_name,
        u.email,
        u.phone,
        p.product_name,
        oi.quantity,
        oi.price
      FROM Orders o
      JOIN Users u
        ON o.user_id = u.user_id
      JOIN Order_Items oi
        ON o.order_id = oi.order_id
      JOIN Product p
        ON oi.product_id = p.product_id
      WHERE o.order_id = ?
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await db.query(
      "UPDATE Orders SET status = ? WHERE order_id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};