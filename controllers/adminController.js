const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM Admin WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = result[0];

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  });
};
// Create Admin (Super Admin)
const createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO Admin (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [name, email, hashedPassword, role || "admin"],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(201).json({
        message: "Admin created successfully",
        adminId: result.insertId,
      });
    }
  );
};

// Get All Admins
const getAllAdmins = (req, res) => {
  const sql =
    "SELECT admin_id, name, email, role FROM Admin";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(result);
  });
};

// Delete Admin
const deleteAdmin = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Admin WHERE admin_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  });
};

module.exports = {
  loginAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
};