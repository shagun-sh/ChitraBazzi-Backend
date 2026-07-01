const db = require("../config/db");

// Get All Customers
const getAllCustomers = async (req, res) => {
  try {
    const [result] = await db.query(`
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
    `);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Customer By ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
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
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
};