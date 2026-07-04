const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, profile: user.profile, stats: user.stats, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    user.lastActive = new Date();
    await user.save();

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
        avatar: user.avatar, bio: user.bio,
        profile: user.profile, stats: user.stats,
        solvedProblems: user.solvedProblems,
        bookmarkedProblems: user.bookmarkedProblems,
        badges: user.badges,
        activityMap: user.activityMap ? Object.fromEntries(user.activityMap) : {},
        notes: user.notes ? Object.fromEntries(user.notes) : {},
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
        avatar: user.avatar, bio: user.bio,
        profile: user.profile, stats: user.stats,
        solvedProblems: user.solvedProblems,
        bookmarkedProblems: user.bookmarkedProblems,
        badges: user.badges,
        activityMap: user.activityMap ? Object.fromEntries(user.activityMap) : {},
        notes: user.notes ? Object.fromEntries(user.notes) : {},
      },
    });
  } catch (error) {
    console.error("Me Route Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio, avatar, profile } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (profile) {
      if (profile.institution !== undefined) user.profile.institution = profile.institution;
      if (profile.role) user.profile.role = profile.role;
      if (profile.preferredLanguage) user.profile.preferredLanguage = profile.preferredLanguage;
      if (profile.theme) user.profile.theme = profile.theme;
      if (profile.fontSize) user.profile.fontSize = profile.fontSize;
    }

    await user.save();
    res.json({
      success: true,
      user: {
        id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
        avatar: user.avatar, bio: user.bio,
        profile: user.profile, stats: user.stats,
        solvedProblems: user.solvedProblems,
        bookmarkedProblems: user.bookmarkedProblems,
        badges: user.badges,
        activityMap: user.activityMap ? Object.fromEntries(user.activityMap) : {},
        notes: user.notes ? Object.fromEntries(user.notes) : {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/notes/:problemId
router.put("/notes/:problemId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notes.set(req.params.problemId, req.body.note);
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/bookmark/:problemId
router.put("/bookmark/:problemId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = parseInt(req.params.problemId);
    const idx = user.bookmarkedProblems.indexOf(pid);

    if (idx === -1) {
      user.bookmarkedProblems.push(pid);
    } else {
      user.bookmarkedProblems.splice(idx, 1);
    }

    await user.save();
    res.json({ success: true, bookmarked: user.bookmarkedProblems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// @route   POST /api/auth/admin-login
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    user.lastActive = new Date();
    await user.save();

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
        avatar: user.avatar, bio: user.bio,
        profile: user.profile, stats: user.stats,
        solvedProblems: user.solvedProblems,
        bookmarkedProblems: user.bookmarkedProblems,
        badges: user.badges,
        activityMap: user.activityMap ? Object.fromEntries(user.activityMap) : {},
        notes: user.notes ? Object.fromEntries(user.notes) : {},
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/seed-admin
router.post("/seed-admin", async (req, res) => {
  try {
    let admin = await User.findOne({ email: "admin@codeskill.com" });
    if (admin) {
      return res.json({ success: true, message: "Admin already exists", user: admin });
    }

    admin = await User.create({
      name: "Admin User",
      email: "admin@codeskill.com",
      password: "password123",
      isAdmin: true
    });

    res.status(201).json({ success: true, message: "Admin created successfully (admin@codeskill.com / password123)" });
  } catch (error) {
    console.error("Seed Admin Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const { sendOTP, verifyOTP } = require("../services/otpService");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to return standardized auth response
const authResponse = (user, res) => {
  const token = user.getSignedJwtToken();
  res.json({
    success: true,
    token,
    user: {
      id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
      avatar: user.avatar, bio: user.bio, profile: user.profile, stats: user.stats,
      authProvider: user.authProvider
    },
  });
};

// @route   POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub, picture } = payload;

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: picture,
        authProvider: "google"
      });
    }

    authResponse(user, res);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ success: false, message: "Google authentication failed" });
  }
});

// @route   POST /api/auth/github
router.post("/github", async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange code for access token
    const tokenResponse = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, { headers: { Accept: "application/json" } });

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) throw new Error("No access token from GitHub");

    // Fetch user profile
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Fetch emails (GitHub can have private emails)
    const emailsResponse = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const primaryEmail = emailsResponse.data.find(e => e.primary)?.email || emailsResponse.data[0]?.email;
    const { id, name, login, avatar_url } = userResponse.data;

    let user = await User.findOne({ email: primaryEmail });
    if (user) {
      if (!user.githubId) {
        user.githubId = id.toString();
        if (!user.avatar) user.avatar = avatar_url;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || login,
        email: primaryEmail,
        githubId: id.toString(),
        avatar: avatar_url,
        authProvider: "github"
      });
    }

    authResponse(user, res);
  } catch (error) {
    console.error("GitHub Auth Error:", error.response?.data || error.message);
    res.status(401).json({ success: false, message: "GitHub authentication failed" });
  }
});

// @route   POST /api/auth/linkedin
router.post("/linkedin", async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    // Exchange code for access token
    const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
      params: {
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: redirectUri,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const accessToken = tokenResponse.data.access_token;
    
    // Fetch profile (LinkedIn OpenID Connect)
    const userResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { sub, name, email, picture } = userResponse.data;

    let user = await User.findOne({ email });
    if (user) {
      if (!user.linkedinId) {
        user.linkedinId = sub;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        linkedinId: sub,
        avatar: picture,
        authProvider: "linkedin"
      });
    }

    authResponse(user, res);
  } catch (error) {
    console.error("LinkedIn Auth Error:", error.response?.data || error.message);
    res.status(401).json({ success: false, message: "LinkedIn authentication failed" });
  }
});

// @route   POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    
    await sendOTP(email);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code, name } = req.body;
    
    await verifyOTP(email, code);

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0], // Default name if new user
        email,
        authProvider: "otp"
      });
    }

    authResponse(user, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

