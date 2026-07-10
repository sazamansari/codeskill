const express = require("express");
const router = express.Router();
const Batch = require("../../models/Batch");
const StudentEnrollment = require("../../models/StudentEnrollment");
const User = require("../../models/User");
const { protect } = require("../../middleware/auth");
const { authorizeCampus } = require("../../middleware/campusAuth");

// @route   GET /api/campus/students
// @desc    Get all students enrolled across all batches in the university
// @access  Private + Campus Member
router.get("/", protect, authorizeCampus(), async (req, res) => {
  try {
    const enrollments = await StudentEnrollment.find({ university: req.universityId, isActive: true })
      .populate("student", "name email avatar")
      .populate("batch", "name graduationYear department")
      .sort({ createdAt: -1 });

    res.json({ success: true, students: enrollments });
  } catch (error) {
    console.error("Get All Campus Students Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/campus/students/mock
// @desc    Generate mock students for the university
// @access  Private + Campus Admin/Professor/TPO
router.post("/mock", protect, authorizeCampus(["Admin", "Professor", "TPO"]), async (req, res) => {
  try {
    // 1. Check if the university has any batches
    const batches = await Batch.find({ university: req.universityId });
    if (batches.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No batches found. Please create at least one batch first before generating students." 
      });
    }

    // 2. Fetch random users from DB (excluding current user)
    const users = await User.find({ _id: { $ne: req.user._id } }).limit(15);
    
    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No other users exist in the DB to use as mock students." 
      });
    }

    // 3. Assign them randomly to batches
    let count = 0;
    for (let i = 0; i < users.length; i++) {
      const randomBatch = batches[Math.floor(Math.random() * batches.length)];
      
      try {
        // Prevent creating duplicates via the unique index constraint
        await StudentEnrollment.create({
          university: req.universityId,
          batch: randomBatch._id,
          student: users[i]._id,
          rollNumber: `ROLL-${Math.floor(Math.random() * 90000) + 10000}`
        });
        count++;
      } catch (err) {
        // Ignore duplicate key errors if they are already enrolled
        if (err.code !== 11000) {
          console.error("Mock Enrollment Error:", err);
        }
      }
    }

    res.status(201).json({ 
      success: true, 
      message: `Generated ${count} new mock students across your batches.`, 
      count 
    });
  } catch (error) {
    console.error("Mock Students Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
