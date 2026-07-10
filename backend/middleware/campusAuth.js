const UniversityUser = require("../models/UniversityUser");

const authorizeCampus = (roles = []) => {
  return async (req, res, next) => {
    try {
      const universityId = req.header("X-University-ID") || req.params.universityId || req.query.universityId;

      if (!universityId) {
        return res.status(400).json({ success: false, message: "University ID is required" });
      }

      const universityUser = await UniversityUser.findOne({
        university: universityId,
        user: req.user._id,
        isActive: true,
      });

      if (!universityUser) {
        return res.status(403).json({ success: false, message: "Access denied. You do not belong to this university." });
      }

      if (roles.length > 0 && !roles.includes(universityUser.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Requires one of the following roles: ${roles.join(", ")}` 
        });
      }

      req.universityId = universityId;
      req.campusRole = universityUser.role;
      
      next();
    } catch (error) {
      console.error("Campus Auth Middleware Error:", error);
      res.status(500).json({ success: false, message: "Server Error during campus authorization" });
    }
  };
};

module.exports = { authorizeCampus };
