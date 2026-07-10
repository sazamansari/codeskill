const express = require("express");
const router = express.Router();
const University = require("../../models/University");
const { protect } = require("../../middleware/auth");

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

router.use(protect, authorizeAdmin);

// @route   GET /api/admin/universities
// @desc    Get all universities
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
      ];
    }

    const universities = await University.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, universities });
  } catch (error) {
    console.error("Admin Get Universities Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/universities/:id/verify
// @desc    Toggle university verification status
router.put("/:id/verify", async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    university.isVerified = !university.isVerified;
    await university.save();

    res.json({ 
      success: true, 
      message: `University ${university.name} is now ${university.isVerified ? 'Verified' : 'Unverified'}`,
      university 
    });
  } catch (error) {
    console.error("Admin Verify University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/universities/:id
// @desc    Delete a university
router.delete("/:id", async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    res.json({ success: true, message: "University deleted successfully" });
  } catch (error) {
    console.error("Admin Delete University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
