const express = require("express");
const router = express.Router();
const Batch = require("../../models/Batch");
const StudentEnrollment = require("../../models/StudentEnrollment");
const { protect } = require("../../middleware/auth");
const { authorizeCampus } = require("../../middleware/campusAuth");

// @route   GET /api/campus/batches
// @desc    Get all batches for a university
// @access  Private + Campus Member
router.get("/", protect, authorizeCampus(), async (req, res) => {
  try {
    const batches = await Batch.find({ university: req.universityId })
      .populate("createdBy", "name email")
      .sort({ graduationYear: -1, name: 1 });

    res.json({ success: true, batches });
  } catch (error) {
    console.error("Get Campus Batches Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/campus/batches
// @desc    Create a new batch
// @access  Private + Campus Admin/Professor/TPO
router.post("/", protect, authorizeCampus(["Admin", "Professor", "TPO"]), async (req, res) => {
  try {
    const newBatch = await Batch.create({
      ...req.body,
      university: req.universityId,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, batch: newBatch });
  } catch (error) {
    console.error("Create Batch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/campus/batches/:id/students
// @desc    Get students enrolled in a specific batch
// @access  Private + Campus Member
router.get("/:id/students", protect, authorizeCampus(), async (req, res) => {
  try {
    const enrollments = await StudentEnrollment.find({ 
      batch: req.params.id, 
      university: req.universityId,
      isActive: true
    }).populate("student", "name email avatar");

    res.json({ success: true, students: enrollments });
  } catch (error) {
    console.error("Get Batch Students Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/campus/batches/:id
// @desc    Delete a batch
// @access  Private + Campus Admin
router.delete("/:id", protect, authorizeCampus(["Admin"]), async (req, res) => {
  try {
    // Check if students are enrolled
    const studentCount = await StudentEnrollment.countDocuments({ batch: req.params.id });
    
    if (studentCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete a batch that has enrolled students. Please remove students first." 
      });
    }

    const batch = await Batch.findOneAndDelete({ _id: req.params.id, university: req.universityId });
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Delete Batch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
