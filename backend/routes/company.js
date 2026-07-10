const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const CompanyUser = require("../models/CompanyUser");
const { protect } = require("../middleware/auth");
const { authorizeCompany } = require("../middleware/companyAuth");

// @route   POST /api/company
// @desc    Register a new company
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, username, industry, website } = req.body;

    // Check if username is taken
    const existingCompany = await Company.findOne({ username: username.toLowerCase() });
    if (existingCompany) {
      return res.status(400).json({ success: false, message: "Company username already exists" });
    }

    // Create Company
    const company = await Company.create({
      name,
      username,
      industry,
      website,
      createdBy: req.user._id,
    });

    // Automatically make the creator an Owner
    await CompanyUser.create({
      company: company._id,
      user: req.user._id,
      role: "Owner",
    });

    res.status(201).json({ success: true, company });
  } catch (error) {
    console.error("Register Company Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/company/my-companies
// @desc    Get all companies the user belongs to
// @access  Private
router.get("/my-companies", protect, async (req, res) => {
  try {
    const memberships = await CompanyUser.find({ user: req.user._id, isActive: true })
      .populate("company")
      .sort({ createdAt: -1 });

    res.json({ success: true, companies: memberships });
  } catch (error) {
    console.error("Get My Companies Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/company/:companyId
// @desc    Get company profile
// @access  Private + Company Member
router.get("/:companyId", protect, authorizeCompany(), async (req, res) => {
  try {
    const company = await Company.findById(req.companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.json({ success: true, company });
  } catch (error) {
    console.error("Get Company Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/company/:companyId
// @desc    Update company profile
// @access  Private + Company Owner/Admin
router.put("/:companyId", protect, authorizeCompany(["Owner", "Admin"]), async (req, res) => {
  try {
    const updates = req.body;
    
    // Prevent changing critical fields like username unless explicitly allowed
    delete updates.username;
    delete updates.createdBy;

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, company });
  } catch (error) {
    console.error("Update Company Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
