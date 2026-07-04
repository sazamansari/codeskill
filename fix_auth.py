import re

with open('/Users/mdshadabazamansari/Downloads/Source Code/backend/routes/auth.js', 'r') as f:
    content = f.read()

# Add isAdmin to register payload
content = content.replace(
    'user: { id: user._id, name: user.name, email: user.email, profile: user.profile, stats: user.stats },',
    'user: { id: user._id, name: user.name, email: user.email, profile: user.profile, stats: user.stats, isAdmin: user.isAdmin },'
)

# Add isAdmin to login payload
content = content.replace(
    'id: user._id, name: user.name, email: user.email,',
    'id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,'
)

# Wait, the replace string for login payload applies to both /login and /me routes because they share the exact string 'id: user._id, name: user.name, email: user.email,'
# This will beautifully fix both at the same time.

# Now append the new routes before module.exports
new_routes = """
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

module.exports = router;
"""

content = content.replace('module.exports = router;', new_routes)

with open('/Users/mdshadabazamansari/Downloads/Source Code/backend/routes/auth.js', 'w') as f:
    f.write(content)
