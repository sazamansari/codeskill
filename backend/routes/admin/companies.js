const express = require("express");
const router = express.Router();
const Company = require("../../models/Company");
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

// @route   GET /api/admin/companies
// @desc    Get all companies (with optional search)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
      ];
    }

    const companies = await Company.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, companies });
  } catch (error) {
    console.error("Admin Get Companies Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/companies/:id/verify
// @desc    Toggle company verification status
router.put("/:id/verify", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    company.isVerified = !company.isVerified;
    await company.save();

    res.json({ 
      success: true, 
      message: `Company ${company.name} is now ${company.isVerified ? 'Verified' : 'Unverified'}`,
      company 
    });
  } catch (error) {
    console.error("Admin Verify Company Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/companies/:id
// @desc    Delete a company
router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // In a real production app, we would also delete associated Jobs, Applications, CompanyUsers here
    // For now, we just delete the Company record

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Company Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
