const db = require("../config/db");

// Get All Customers
const getAllCustomers = (req, res) => {
  const sql = `
    SELECT
      u.user_id,
      u.full_name,
      u.email,
      u.phone,
      COUNT(o.order_id) AS total_orders
    FROM Users u
    LEFT JOIN Orders o
      ON u.user_id = o.user_id
    GROUP BY
      u.user_id,
      u.full_name,
      u.email,
      u.phone
    ORDER BY u.user_id DESC
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

// Get Customer By ID
const getCustomerById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      u.user_id,
      u.full_name,
      u.email,
      u.phone,
      COUNT(o.order_id) AS total_orders,
      IFNULL(SUM(o.total_amount),0) AS total_spent
    FROM Users u
    LEFT JOIN Orders o
      ON u.user_id = o.user_id
    WHERE u.user_id = ?
    GROUP BY
      u.user_id,
      u.full_name,
      u.email,
      u.phone
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(result[0]);
  });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
};