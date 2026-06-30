const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} = require("../controllers/adminController");

const verifyToken = require("../middleware/verifyToken");
const checkSuperAdmin = require("../middleware/checkSuperAdmin");


router.post("/login", loginAdmin);
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json(req.admin);
});
router.post(
  "/create",
  verifyToken,
  checkSuperAdmin,
  createAdmin
);

router.get(
  "/",
  verifyToken,
  checkSuperAdmin,
  getAllAdmins
);

router.delete(
  "/:id",
  verifyToken,
  checkSuperAdmin,
  deleteAdmin
);

module.exports = router;