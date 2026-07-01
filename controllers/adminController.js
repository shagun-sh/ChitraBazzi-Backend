const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [result] = await db.query(
      "SELECT * FROM Admin WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = result[0];

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
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
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO Admin (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "admin"]
    );

    res.status(201).json({
      message: "Admin created successfully",
      adminId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT admin_id, name, email, role FROM Admin"
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Admin WHERE admin_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
};