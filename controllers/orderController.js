const db = require("../config/db");

// Get All Orders
const getAllOrders = (req, res) => {
  const sql = `
    SELECT
      o.order_id,
      u.full_name,
      u.email,
      o.order_date,
      o.total_amount,
      o.status
    FROM Orders o
    JOIN Users u ON o.user_id = u.user_id
    ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(result);
  });
};

// Get Order By ID
const getOrderById = (req, res) => {
  const { id } = req.params;

  const sql = `
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
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(result);
  });
};

// Update Order Status
const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql =
    "UPDATE Orders SET status = ? WHERE order_id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
    });
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};