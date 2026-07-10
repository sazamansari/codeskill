const express = require("express");
const router = express.Router();
const University = require("../models/University");
const UniversityUser = require("../models/UniversityUser");
const { protect } = require("../middleware/auth");
const { authorizeCampus } = require("../middleware/campusAuth");

// @route   POST /api/campus
// @desc    Register a new university
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, username, domain, website } = req.body;

    const existingUniversity = await University.findOne({ username: username.toLowerCase() });
    if (existingUniversity) {
      return res.status(400).json({ success: false, message: "University username already exists" });
    }

    const university = await University.create({
      name,
      username,
      domain,
      website,
      createdBy: req.user._id,
    });

    // Automatically make the creator an Admin
    await UniversityUser.create({
      university: university._id,
      user: req.user._id,
      role: "Admin",
    });

    res.status(201).json({ success: true, university });
  } catch (error) {
    console.error("Register University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/campus/my-universities
// @desc    Get all universities the user belongs to
// @access  Private
router.get("/my-universities", protect, async (req, res) => {
  try {
    const memberships = await UniversityUser.find({ user: req.user._id, isActive: true })
      .populate("university")
      .sort({ createdAt: -1 });

    res.json({ success: true, universities: memberships });
  } catch (error) {
    console.error("Get My Universities Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/campus/:universityId
// @desc    Get university profile
// @access  Private + Campus Member
router.get("/:universityId", protect, authorizeCampus(), async (req, res) => {
  try {
    const university = await University.findById(req.universityId);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }
    res.json({ success: true, university });
  } catch (error) {
    console.error("Get University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/campus/:universityId
// @desc    Update university profile
// @access  Private + Campus Admin
router.put("/:universityId", protect, authorizeCampus(["Admin"]), async (req, res) => {
  try {
    const updates = req.body;
    
    delete updates.username;
    delete updates.createdBy;

    const university = await University.findByIdAndUpdate(
      req.universityId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, university });
  } catch (error) {
    console.error("Update University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
