const express = require("express");
const router = express.Router();
const User = require("../../models/User");
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

// @route   GET /api/admin/users
// @desc    Get all users (with optional search)
router.get("/", async (req, res) => {
  try {
    const { search, adminsOnly } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (adminsOnly === "true") {
      query.isAdmin = true;
    }

    const users = await User.find(query)
      .select("name email isAdmin avatar createdAt lastActive")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:userId/promote
// @desc    Promote a user to admin
router.put("/:userId/promote", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ success: false, message: "User is already an admin" });
    }

    user.isAdmin = true;
    await user.save();

    console.log(`[Admin] ${req.user.email} promoted ${user.email} to admin`);
    res.json({ success: true, message: `${user.email} is now an admin`, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error("Admin Promote Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:userId/demote
// @desc    Remove admin access from a user
router.put("/:userId/demote", async (req, res) => {
  try {
    // Prevent self-demotion
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot remove your own admin access" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ success: false, message: "User is not an admin" });
    }

    user.isAdmin = false;
    await user.save();

    console.log(`[Admin] ${req.user.email} demoted ${user.email} from admin`);
    res.json({ success: true, message: `${user.email} is no longer an admin`, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error("Admin Demote Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
