const express = require("express");
const router = express.Router();
const Application = require("../../models/Application");
const Job = require("../../models/Job");
const User = require("../../models/User");
const { protect } = require("../../middleware/auth");
const { authorizeCompany } = require("../../middleware/companyAuth");

// @route   GET /api/company/applications
// @desc    Get all applications for a company
// @access  Private + Company Member
router.get("/", protect, authorizeCompany(), async (req, res) => {
  try {
    const applications = await Application.find({ company: req.companyId })
      .populate("job", "title")
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/company/applications/:id/stage
// @desc    Update candidate's pipeline stage (Drag and Drop)
// @access  Private + Company Member
router.put("/:id/stage", protect, authorizeCompany(), async (req, res) => {
  try {
    const { stage } = req.body;
    
    const validStages = ["Applied", "Assessment", "Interview", "Technical Round", "HR Round", "Offer", "Hired", "Rejected"];
    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: "Invalid pipeline stage" });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, company: req.companyId },
      { $set: { stage } },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error("Update Stage Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/company/applications/mock
// @desc    Generate mock candidates for Kanban board testing
// @access  Private + Company Member
router.post("/mock", protect, authorizeCompany(), async (req, res) => {
  try {
    // 1. Check if the company has any jobs
    let job = await Job.findOne({ company: req.companyId });
    if (!job) {
      // Create a dummy job if none exists
      job = await Job.create({
        company: req.companyId,
        title: "Software Engineer",
        description: "A great role for a software engineer.",
        createdBy: req.user._id,
      });
    }

    // 2. Fetch some random users from the DB to act as candidates
    // We'll just grab the first 10 users that aren't the current user
    const users = await User.find({ _id: { $ne: req.user._id } }).limit(10);
    
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: "No other users exist in the DB to use as mock candidates." });
    }

    // 3. Create applications spread randomly across different stages
    const stages = ["Applied", "Assessment", "Interview", "Technical Round", "HR Round", "Offer"];
    const newApplications = [];

    for (let i = 0; i < users.length; i++) {
      // Delete existing application if any to avoid unique constraint errors
      await Application.deleteOne({ job: job._id, user: users[i]._id });

      const randomStage = stages[Math.floor(Math.random() * stages.length)];
      const app = await Application.create({
        company: req.companyId,
        job: job._id,
        user: users[i]._id,
        stage: randomStage,
      });
      newApplications.push(app);
    }

    res.status(201).json({ success: true, message: `Generated ${newApplications.length} mock candidates`, count: newApplications.length });
  } catch (error) {
    console.error("Mock Applications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
