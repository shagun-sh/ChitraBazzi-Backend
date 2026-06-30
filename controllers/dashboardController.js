const db = require("../config/db");

const getDashboard = (req, res) => {
 const sql = `
SELECT
  (SELECT COUNT(*) FROM Product) AS totalProducts,
  (SELECT COUNT(*) FROM Orders) AS totalOrders,
  (SELECT COUNT(*) FROM Users) AS totalCustomers,
  (SELECT IFNULL(SUM(total_amount),0) FROM Orders) AS totalRevenue,

  (SELECT COUNT(*) FROM Orders WHERE status='Pending') AS pendingOrders,
  (SELECT COUNT(*) FROM Orders WHERE status='Processing') AS processingOrders,
  (SELECT COUNT(*) FROM Orders WHERE status='Shipped') AS shippedOrders,
  (SELECT COUNT(*) FROM Orders WHERE status='Delivered') AS deliveredOrders,
  (SELECT COUNT(*) FROM Orders WHERE status='Cancelled') AS cancelledOrders
`;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json(result[0]);
  });
};

module.exports = {
  getDashboard,
};