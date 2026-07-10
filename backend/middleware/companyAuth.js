const CompanyUser = require("../models/CompanyUser");

// Middleware to verify a user belongs to a company and optionally has specific roles
const authorizeCompany = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Company ID should be passed in headers, or params.
      // Usually, we pass `X-Company-ID` header for all company-related requests.
      const companyId = req.header("X-Company-ID") || req.params.companyId || req.query.companyId;

      if (!companyId) {
        return res.status(400).json({ success: false, message: "Company ID is required" });
      }

      // Check if user is associated with this company
      const companyUser = await CompanyUser.findOne({
        company: companyId,
        user: req.user._id,
        isActive: true,
      });

      if (!companyUser) {
        return res.status(403).json({ success: false, message: "Access denied. You do not belong to this company." });
      }

      // If specific roles are required, check them
      if (roles.length > 0 && !roles.includes(companyUser.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Requires one of the following roles: ${roles.join(", ")}` 
        });
      }

      // Attach company info to request
      req.companyId = companyId;
      req.companyRole = companyUser.role;
      
      next();
    } catch (error) {
      console.error("Company Auth Middleware Error:", error);
      res.status(500).json({ success: false, message: "Server Error during company authorization" });
    }
  };
};

module.exports = { authorizeCompany };
