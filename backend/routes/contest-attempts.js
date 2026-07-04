const express = require("express");
const router = express.Router();
const ContestAttempt = require("../models/ContestAttempt");
const Contest = require("../models/Contest");
const { protect } = require("../middleware/auth");
const { emitToUser } = require("../websockets/contestGateway");

router.use(protect);

// @route   POST /api/contest-attempts/start
// @desc    Start a contest attempt (called after fullscreen entered and rules accepted)
router.post("/start", async (req, res) => {
  try {
    const { contestId, deviceFingerprint, sessionId } = req.body;
    const userId = req.user.id;

    // Check if contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ success: false, message: "Contest not found" });

    // Check if already attempted
    let attempt = await ContestAttempt.findOne({ contestId, userId });

    if (attempt) {
      if (attempt.status === "Submitted" || attempt.status === "Disqualified") {
        return res.status(403).json({ success: false, message: "Contest already completed" });
      }

      // Reconnect logic
      // If multiple device protection is on, check sessionId
      if (contest.antiCheatConfig?.enableMultipleDeviceProtect) {
        if (attempt.sessionId !== sessionId) {
          return res.status(403).json({ 
            success: false, 
            message: "Multiple device login detected. Please use your original session or contact support." 
          });
        }
      }
      
      return res.json({ success: true, message: "Reconnected", data: attempt });
    }

    // Create new attempt
    attempt = await ContestAttempt.create({
      contestId,
      userId,
      sessionId,
      deviceFingerprint,
      status: "InProgress"
    });

    res.status(201).json({ success: true, data: attempt });
  } catch (error) {
    console.error("Start Contest Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/contest-attempts/violation
// @desc    Log an anti-cheat violation
router.post("/violation", async (req, res) => {
  try {
    const { contestId, type, metadata } = req.body;
    const userId = req.user.id;

    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ success: false, message: "Contest not found" });

    let attempt = await ContestAttempt.findOne({ contestId, userId });
    if (!attempt) return res.status(404).json({ success: false, message: "Attempt not found" });

    if (attempt.status !== "InProgress") {
      return res.status(400).json({ success: false, message: "Contest is no longer in progress" });
    }

    // Add violation
    attempt.violations.push({
      type,
      metadata
    });
    
    attempt.warnings += 1;

    // Check if max warnings reached
    const maxWarnings = contest.antiCheatConfig?.warningLimit || 5;
    if (attempt.warnings >= maxWarnings && contest.antiCheatConfig?.autoSubmitOnViolation) {
      attempt.status = "AutoSubmitted";
      attempt.submittedAt = new Date();
      await attempt.save();
      
      // Notify via WebSocket to kick the user immediately
      emitToUser(contestId, userId, "force_submit", { reason: "Maximum warnings exceeded" });
      
      return res.json({ success: true, forceSubmit: true, warnings: attempt.warnings });
    }

    await attempt.save();
    res.json({ success: true, warnings: attempt.warnings });
  } catch (error) {
    console.error("Log Violation Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/contest-attempts/autosave
// @desc    Autosave code progress
router.post("/autosave", async (req, res) => {
  try {
    const { contestId, problemId, code, language } = req.body;
    const userId = req.user.id;

    let attempt = await ContestAttempt.findOne({ contestId, userId });
    if (!attempt || attempt.status !== "InProgress") {
      return res.status(400).json({ success: false, message: "Cannot save. Invalid state." });
    }

    const problemIndex = attempt.savedCode.findIndex(p => p.problemId.toString() === problemId);
    if (problemIndex > -1) {
      attempt.savedCode[problemIndex].code = code;
      attempt.savedCode[problemIndex].language = language;
      attempt.savedCode[problemIndex].lastSaved = new Date();
    } else {
      attempt.savedCode.push({ problemId, code, language });
    }

    await attempt.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Autosave Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
