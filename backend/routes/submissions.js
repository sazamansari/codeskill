const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route   POST /api/submissions
router.post("/", protect, async (req, res) => {
  try {
    const { problemId, language, code, status, runtime, memory, testCasesPassed, totalTestCases, category, difficulty } = req.body;

    const submission = await Submission.create({
      user: req.user._id, problemId, language, code, status,
      runtime, memory, testCasesPassed, totalTestCases, category, difficulty,
    });

    // Update user stats on accepted submission
    const user = await User.findById(req.user._id);
    user.stats.totalSubmissions += 1;

    if (status === "accepted" && !user.solvedProblems.includes(problemId)) {
      user.solvedProblems.push(problemId);
      user.stats.totalSolved += 1;
      user.stats.acceptedSubmissions += 1;

      // Difficulty stats
      if (difficulty === "Easy") user.stats.easySolved += 1;
      else if (difficulty === "Medium") user.stats.mediumSolved += 1;
      else if (difficulty === "Hard") user.stats.hardSolved += 1;

      // Category stats
      if (category === "Programming") user.stats.dsaSolved += 1;
      else if (category === "Database") user.stats.sqlSolved += 1;
      else if (category === "Web") user.stats.jsSolved += 1;

      // XP: Easy=10, Medium=25, Hard=50
      const xpMap = { Easy: 10, Medium: 25, Hard: 50 };
      user.stats.xp += xpMap[difficulty] || 10;

      // Update streak
      user.updateStreak();

      // Check and award badges
      const newBadges = checkBadges(user);
      for (const badge of newBadges) {
        if (!user.badges.find((b) => b.badgeId === badge)) {
          user.badges.push({ badgeId: badge, unlockedAt: new Date() });
        }
      }

      await user.save();
    } else {
      await user.save();
    }

    res.status(201).json({ success: true, submission, stats: user.stats, badges: user.badges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/submissions/problem/:problemId
router.get("/problem/:problemId", protect, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      problemId: req.params.problemId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/submissions/recent
router.get("/recent", protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("problemId language status runtime createdAt");

    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/submissions/stats
router.get("/stats", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recentSubmissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("problemId language status runtime createdAt difficulty");

    res.json({
      success: true,
      stats: user.stats,
      solvedProblems: user.solvedProblems,
      badges: user.badges,
      activityMap: Object.fromEntries(user.activityMap),
      recentSubmissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Badge check helper
function checkBadges(user) {
  const earned = [];
  const s = user.stats;

  if (s.totalSolved >= 1) earned.push("first_solve");
  if (s.totalSolved >= 5) earned.push("five_solved");
  if (s.totalSolved >= 10) earned.push("ten_solved");
  if (s.totalSolved >= 25) earned.push("twentyfive_solved");
  if (s.totalSolved >= 50) earned.push("fifty_solved");
  if (s.totalSolved >= 100) earned.push("century");
  if (s.hardSolved >= 1) earned.push("hard_first");
  if (s.hardSolved >= 10) earned.push("hard_master");
  if (s.currentStreak >= 3) earned.push("streak_3");
  if (s.currentStreak >= 7) earned.push("streak_7");
  if (s.currentStreak >= 30) earned.push("streak_30");
  if (s.dsaSolved >= 10 && s.sqlSolved >= 10 && s.jsSolved >= 10) earned.push("polyglot");
  if (s.xp >= 500) earned.push("xp_500");
  if (s.xp >= 1000) earned.push("xp_1000");

  return earned;
}

module.exports = router;
