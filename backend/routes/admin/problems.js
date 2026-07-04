const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProblemMetadata = require("../../models/ProblemMetadata");
const ProblemStatement = require("../../models/ProblemStatement");
const ProblemConfig = require("../../models/ProblemConfig");
const ProblemTestCase = require("../../models/ProblemTestCase");
const { protect } = require("../../middleware/auth");
const { QuestionCache } = require("../../redis");

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

router.use(protect);
router.use(authorizeAdmin);

// @route   GET /api/admin/problems
// @desc    Get all problems (listing uses only Metadata for speed)
router.get("/", async (req, res) => {
  try {
    const problems = await ProblemMetadata.find({}).sort("-createdAt");
    res.json({ success: true, count: problems.length, data: problems });
  } catch (error) {
    console.error("Get Problems Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/admin/problems
// @desc    Create a new split-collection problem
router.post("/", async (req, res) => {
  try {
    const { 
      metadata, 
      statement, 
      config, 
      testCases 
    } = req.body;

    // 1. Create Metadata first to get ID
    const newMetadata = await ProblemMetadata.create(metadata);
    const metadataId = newMetadata._id;

    // 2. Create nested documents linking back to Metadata
    const newStatement = await ProblemStatement.create({ ...statement, metadataId });
    const newConfig = await ProblemConfig.create({ ...config, metadataId });
    const newTestCases = await ProblemTestCase.create({ ...testCases, metadataId });

    // 3. Update Metadata with relations
    newMetadata.statement = newStatement._id;
    newMetadata.config = newConfig._id;
    newMetadata.testCases = newTestCases._id;
    await newMetadata.save();

    // Redis: Invalidate list cache
    QuestionCache.invalidateQuestion(newMetadata.slug, metadataId.toString());

    res.status(201).json({ success: true, data: newMetadata });
  } catch (error) {
    console.error("Create Problem Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/problems/:id
// @desc    Get complete problem by ID with populated split collections
router.get("/:id", async (req, res) => {
  try {
    const problem = await ProblemMetadata.findById(req.params.id)
      .populate("statement")
      .populate("config")
      .populate("testCases");

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.json({ success: true, data: problem });
  } catch (error) {
    console.error("Get Problem Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   PUT /api/admin/problems/:id
// @desc    Update a problem across collections
router.put("/:id", async (req, res) => {
  try {
    const problem = await ProblemMetadata.findByIdAndUpdate(req.params.id, req.body.metadata, {
      new: true,
      runValidators: true,
    });
    
    // Also update statement/config if provided
    if (req.body.statement) {
       await ProblemStatement.findOneAndUpdate({ metadataId: req.params.id }, req.body.statement);
    }
    if (req.body.config) {
       await ProblemConfig.findOneAndUpdate({ metadataId: req.params.id }, req.body.config);
    }
    if (req.body.testCases) {
       await ProblemTestCase.findOneAndUpdate({ metadataId: req.params.id }, req.body.testCases);
    }

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Redis: Invalidate cache for this problem
    QuestionCache.invalidateQuestion(problem.slug, problem._id.toString());

    res.json({ success: true, data: problem });
  } catch (error) {
    console.error("Update Problem Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/problems/:id
// @desc    Delete a problem and all its split parts
router.delete("/:id", async (req, res) => {
  try {
    await ProblemStatement.deleteOne({ metadataId: req.params.id });
    await ProblemConfig.deleteOne({ metadataId: req.params.id });
    await ProblemTestCase.deleteOne({ metadataId: req.params.id });
    
    const problem = await ProblemMetadata.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Redis: Invalidate cache
    QuestionCache.invalidateQuestion(problem.slug, problem._id.toString());

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error("Delete Problem Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
