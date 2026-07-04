const express = require("express");
const router = express.Router();
const ProblemMetadata = require("../models/ProblemMetadata");
const { cacheMiddleware, keys } = require("../redis");

// @route   GET /api/problems
// @desc    Get all published problems with pagination
router.get("/", cacheMiddleware((req) => keys.questionsList(req.query.page || 1, req.query.limit || 20, req.query.search || "", req.query.category || ""), 600), async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = { visibility: "Published" };
    
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }
    
    if (req.query.category) {
      query.categories = { $regex: new RegExp(`^${req.query.category}$`, "i") };
    }
    
    const problems = await ProblemMetadata.find(query)
      .select("title slug difficulty categories stats")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
      
    const total = await ProblemMetadata.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({ 
      success: true, 
      data: problems,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    });
  } catch (error) {
    console.error("Get Public Problems Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   GET /api/problems/:slug
// @desc    Get a single problem by slug (fully populated)
router.get("/:slug", cacheMiddleware((req) => keys.questionData(req.params.slug), 600), async (req, res) => {
  try {
    const problem = await ProblemMetadata.findOne({ slug: req.params.slug, visibility: "Published" })
      .populate("statement")
      .populate("config")
      .populate("testCases");

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found or not published" });
    }
    res.json({ success: true, data: problem });
  } catch (error) {
    console.error("Get Public Problem Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
