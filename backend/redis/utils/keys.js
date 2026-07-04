/**
 * Centralized Redis Key Management
 * Maintains consistent naming conventions to avoid collisions.
 */

module.exports = {
  // Problems
  questionData: (slug) => `question:slug:${slug}`,
  questionById: (id) => `question:id:${id}`,
  questionsList: (page = 1, limit = 20, search = "", category = "") => `questions:all:${page}:${limit}:${search}:${category}`,
  
  // Dashboard & Analytics
  dashboardMetrics: () => `analytics:dashboard`,
  trendingQuestions: () => `analytics:trending`,
  popularCompanies: () => `analytics:companies`,
  
  // Caches
  companiesList: () => `cache:companies`,
  universitiesList: () => `cache:universities`,
  tagsList: () => `cache:tags`,
  
  // Autocomplete
  searchAutocomplete: (prefix) => `search:autocomplete:${prefix}`,
  
  // Rate Limiting
  rateLimit: (ip, route) => `ratelimit:${route}:${ip}`,
  
  // OTP
  otpData: (email) => `otp:data:${email}`,
  otpAttempts: (email) => `otp:attempts:${email}`,
  
  // Sessions
  sessionUser: (userId) => `session:user:${userId}`,
  revokedToken: (tokenSignature) => `session:revoked:${tokenSignature}`,
  
  // Drafts
  adminDraft: (adminId, questionId) => `draft:${adminId}:${questionId}`,
  
  // AI
  aiEditorial: (questionId) => `ai:editorial:${questionId}`,
  aiConstraints: (questionId) => `ai:constraints:${questionId}`,
  
  // Leaderboards (Sorted Sets)
  leaderboardGlobal: () => `leaderboard:global`,
  leaderboardContest: (contestId) => `leaderboard:contest:${contestId}`,
  leaderboardCompany: (companyId) => `leaderboard:company:${companyId}`
};
