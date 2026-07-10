const express = require("express");
const router = express.Router();
const Job = require("../../models/Job");
const { protect } = require("../../middleware/auth");
const { authorizeCompany } = require("../../middleware/companyAuth");

// All job routes require user to be part of the company
// Use `authorizeCompany()` which expects `X-Company-ID` header

// @route   GET /api/company/jobs
// @desc    Get all jobs for a company
// @access  Private + Company Member
router.get("/", protect, authorizeCompany(), async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.companyId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Get Company Jobs Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/company/jobs
// @desc    Create a new job
// @access  Private + Company Owner/Admin/Recruiter
router.post("/", protect, authorizeCompany(["Owner", "Admin", "Recruiter", "HR"]), async (req, res) => {
  try {
    const newJob = await Job.create({
      ...req.body,
      company: req.companyId,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/company/jobs/:jobId
// @desc    Update a job
// @access  Private + Company Owner/Admin/Recruiter
router.put("/:jobId", protect, authorizeCompany(["Owner", "Admin", "Recruiter", "HR"]), async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.jobId, company: req.companyId });
    
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, job });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/company/jobs/:jobId
// @desc    Delete a job
// @access  Private + Company Owner/Admin
router.delete("/:jobId", protect, authorizeCompany(["Owner", "Admin"]), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, company: req.companyId });
    
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
