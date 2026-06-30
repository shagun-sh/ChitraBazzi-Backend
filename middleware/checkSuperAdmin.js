const checkSuperAdmin = (req, res, next) => {
  if (req.admin.role !== "super_admin") {
    return res.status(403).json({
      message: "Only Super Admin can access this route",
    });
  }

  next();
};

module.exports = checkSuperAdmin;