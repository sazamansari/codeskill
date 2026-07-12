const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Problem = require("../../models/Problem");
const ProblemVersion = require("../../models/ProblemVersion");
const ProblemStatement = require("../../models/ProblemStatement");
const ProblemEnvironment = require("../../models/ProblemEnvironment");
const ProblemTemplate = require("../../models/ProblemTemplate");
const ProblemSolution = require("../../models/ProblemSolution");
const ProblemTestCase = require("../../models/ProblemTestCase");
const ProblemEditorial = require("../../models/ProblemEditorial");
const AuditLog = require("../../models/AuditLog");
const aiGenerationQueue = require("../../redis/queues/aiGenerationProcessor");
const { randomUUID } = require("crypto");
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
// @desc    Get all problems (cursor-based pagination for speed)
router.get("/", async (req, res) => {
  try {
    const { cursor, limit = 20 } = req.query;
    const limitNum = parseInt(limit, 10);
    
    // Base query
    const query = {};
    if (cursor) {
      // _id is chronologically sortable. For newest-first, we fetch IDs less than the cursor
      query._id = { $lt: cursor };
    }

    const problems = await Problem.find(query)
      .sort({ _id: -1 })
      .limit(limitNum + 1); // Fetch one extra to check if there is a next page

    const hasNextPage = problems.length > limitNum;
    if (hasNextPage) {
      problems.pop(); // Remove the extra item
    }

    const nextCursor = hasNextPage ? problems[problems.length - 1]._id : null;

    res.json({ 
      success: true, 
      data: problems,
      pagination: {
        hasNextPage,
        nextCursor
      }
    });
  } catch (error) {
    console.error("Get Problems Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/admin/problems/generate-ai
// @desc    Trigger asynchronous AI generation for problem fields
router.post("/generate-ai", async (req, res) => {
  try {
    const { prompt, type } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const jobId = randomUUID();
    
    // Push to BullMQ queue
    await aiGenerationQueue.add("generate", {
      prompt,
      type,
      authorId: req.user ? req.user._id : "admin"
    }, {
      jobId, // Set the specific jobId so the client can listen to its room
      removeOnComplete: true
    });

    // Return 202 Accepted immediately
    res.status(202).json({ success: true, jobId, message: "Generation started" });
  } catch (error) {
    console.error("AI Generate Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/admin/problems
// @desc    Create a new 9-collection problem architecture
router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      metadata, 
      statement, 
      environment, 
      template,
      solution,
      testCases,
      editorial
    } = req.body;

    // 1. Create Core Problem
    const newProblem = new Problem({ ...metadata, author: req.user._id });
    await newProblem.save({ session });

    // 2. Create the first Version
    const newVersion = new ProblemVersion({
      problemId: newProblem._id,
      versionNumber: 1,
      status: "Draft",
      createdBy: req.user._id,
    });
    await newVersion.save({ session });

    // 3. Create constituent sub-documents pointing to the Version
    const subDocs = await Promise.all([
      new ProblemStatement({ ...statement, versionId: newVersion._id }).save({ session }),
      new ProblemEnvironment({ ...environment, versionId: newVersion._id }).save({ session }),
      new ProblemTemplate({ ...template, versionId: newVersion._id }).save({ session }),
      new ProblemSolution({ ...solution, versionId: newVersion._id }).save({ session }),
      new ProblemTestCase({ ...testCases, versionId: newVersion._id }).save({ session }),
      new ProblemEditorial({ ...editorial, versionId: newVersion._id }).save({ session })
    ]);

    // 4. Update Version with sub-document references
    newVersion.statementId = subDocs[0]._id;
    newVersion.environmentId = subDocs[1]._id;
    newVersion.templateId = subDocs[2]._id;
    newVersion.solutionId = subDocs[3]._id;
    newVersion.testCaseId = subDocs[4]._id;
    newVersion.editorialId = subDocs[5]._id;
    await newVersion.save({ session });

    // 5. Create Audit Log
    await new AuditLog({
      userId: req.user._id,
      action: "CREATED_DRAFT",
      targetId: newVersion._id,
      details: "Created initial draft for new problem"
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    // Redis: Invalidate list cache
    QuestionCache.invalidateQuestion(newProblem.slug, newProblem._id.toString());

    res.status(201).json({ success: true, data: { problem: newProblem, version: newVersion } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create Problem Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/problems/:id/versions/:versionId
// @desc    Get specific problem version with populated split collections
router.get("/:id/versions/:versionId", async (req, res) => {
  try {
    const version = await ProblemVersion.findById(req.params.versionId)
      .populate("statementId")
      .populate("environmentId")
      .populate("templateId")
      .populate("solutionId")
      .populate("testCaseId")
      .populate("editorialId");

    if (!version || version.problemId.toString() !== req.params.id) {
      return res.status(404).json({ success: false, message: "Version not found" });
    }
    
    const problem = await Problem.findById(req.params.id);
    
    res.json({ success: true, data: { problem, version } });
  } catch (error) {
    console.error("Get Problem Version Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   DELETE /api/admin/problems/:id
// @desc    Delete a problem and all its split parts
router.delete("/:id", async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const versions = await ProblemVersion.find({ problemId: req.params.id });
    const versionIds = versions.map(v => v._id);

    // Delete all linked subdocuments across all versions
    await Promise.all([
      ProblemStatement.deleteMany({ versionId: { $in: versionIds } }),
      ProblemEnvironment.deleteMany({ versionId: { $in: versionIds } }),
      ProblemTemplate.deleteMany({ versionId: { $in: versionIds } }),
      ProblemSolution.deleteMany({ versionId: { $in: versionIds } }),
      ProblemTestCase.deleteMany({ versionId: { $in: versionIds } }),
      ProblemEditorial.deleteMany({ versionId: { $in: versionIds } }),
      ProblemVersion.deleteMany({ problemId: req.params.id }),
      AuditLog.deleteMany({ targetId: { $in: [...versionIds, req.params.id] } })
    ]);

    // Redis: Invalidate cache
    QuestionCache.invalidateQuestion(problem.slug, problem._id.toString());

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error("Delete Problem Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
