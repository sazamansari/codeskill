const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Submission = require("../../models/Submission");
const { protect } = require("../../middleware/auth");

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

// All routes require authentication + admin
router.use(protect, authorizeAdmin);

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, codeSubmissions, activeToday] = await Promise.all([
      User.countDocuments(),
      Submission.countDocuments(),
      User.countDocuments({ lastActive: { $gte: today } }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        codeSubmissions,
        activeToday,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
