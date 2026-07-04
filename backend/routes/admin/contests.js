const express = require("express");
const router = express.Router();
const Contest = require("../../models/Contest");
const { protect } = require("../../middleware/auth");

// Middleware to check if user is admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

// Apply auth and admin middleware to all routes in this file
router.use(protect);
router.use(authorizeAdmin);

// @route   GET /api/admin/contests
// @desc    Get all contests
router.get("/", async (req, res) => {
  try {
    const contests = await Contest.find({})
      .populate("problems", "title difficulty")
      .sort("-startTime");
    res.json({ success: true, count: contests.length, data: contests });
  } catch (error) {
    console.error("Get Contests Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/admin/contests
// @desc    Create a new contest
router.post("/", async (req, res) => {
  try {
    const contest = await Contest.create(req.body);
    res.status(201).json({ success: true, data: contest });
  } catch (error) {
    console.error("Create Contest Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/contests/:id
// @desc    Get single contest by ID
router.get("/:id", async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate("problems", "title difficulty");
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }
    res.json({ success: true, data: contest });
  } catch (error) {
    console.error("Get Contest Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   PUT /api/admin/contests/:id
// @desc    Update a contest
router.put("/:id", async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }
    res.json({ success: true, data: contest });
  } catch (error) {
    console.error("Update Contest Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/contests/:id
// @desc    Delete a contest
router.delete("/:id", async (req, res) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error("Delete Contest Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
