const express = require("express");
const router = express.Router();
const CompanyUser = require("../../models/CompanyUser");
const User = require("../../models/User");
const { protect } = require("../../middleware/auth");
const { authorizeCompany } = require("../../middleware/companyAuth");

// @route   GET /api/company/team
// @desc    Get all team members of a company
// @access  Private + Company Member
router.get("/", protect, authorizeCompany(), async (req, res) => {
  try {
    const teamMembers = await CompanyUser.find({ company: req.companyId, isActive: true })
      .populate("user", "name email avatar")
      .sort({ createdAt: 1 });

    res.json({ success: true, team: teamMembers });
  } catch (error) {
    console.error("Get Company Team Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/company/team/invite
// @desc    Invite/Add a user to the company team
// @access  Private + Company Owner/Admin
router.post("/invite", protect, authorizeCompany(["Owner", "Admin"]), async (req, res) => {
  try {
    const { email, role, designation } = req.body;

    // 1. Find user by email
    const userToInvite = await User.findOne({ email: email.toLowerCase() });
    if (!userToInvite) {
      return res.status(404).json({ success: false, message: "User with this email not found on CodeSkill." });
    }

    // 2. Check if already in company
    const existingMember = await CompanyUser.findOne({ 
      company: req.companyId, 
      user: userToInvite._id 
    });

    if (existingMember) {
      if (!existingMember.isActive) {
        // Reactivate
        existingMember.isActive = true;
        existingMember.role = role || existingMember.role;
        existingMember.designation = designation || existingMember.designation;
        await existingMember.save();
        return res.json({ success: true, message: "User reactivated in team", member: existingMember });
      }
      return res.status(400).json({ success: false, message: "User is already in the company team." });
    }

    // 3. Prevent assigning "Owner" role via invite (only one owner usually, or explicitly transferred)
    if (role === "Owner") {
      return res.status(400).json({ success: false, message: "Cannot invite as Owner directly." });
    }

    // 4. Create CompanyUser
    const newMember = await CompanyUser.create({
      company: req.companyId,
      user: userToInvite._id,
      role: role || "Recruiter",
      designation: designation || "Recruiter",
    });

    // Populate user details for response
    await newMember.populate("user", "name email avatar");

    res.status(201).json({ success: true, member: newMember, message: "User successfully added to team!" });
  } catch (error) {
    console.error("Invite Team Member Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/company/team/:userId
// @desc    Remove a user from the company team (deactivate)
// @access  Private + Company Owner/Admin
router.delete("/:userId", protect, authorizeCompany(["Owner", "Admin"]), async (req, res) => {
  try {
    // Prevent removing yourself
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot remove yourself." });
    }

    const member = await CompanyUser.findOne({ company: req.companyId, user: req.params.userId });
    
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // Prevent Admin from removing Owner
    if (req.companyRole === "Admin" && member.role === "Owner") {
      return res.status(403).json({ success: false, message: "Admins cannot remove Owners." });
    }

    member.isActive = false;
    await member.save();

    res.json({ success: true, message: "Team member removed successfully" });
  } catch (error) {
    console.error("Remove Team Member Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
