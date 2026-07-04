/**
 * Main export file for Redis services.
 * Keeps imports clean across the application.
 */

const { getRedisClient, closeRedis } = require('../config/redis');

// Middleware
const cacheMiddleware = require('./middleware/cacheMiddleware');
const rateLimiter = require('./middleware/rateLimiter');

// Services
const QuestionCache = require('./cache/questionCache');
const GeneralCache = require('./cache/generalCache');
const LeaderboardService = require('./leaderboard/leaderboardService');
const AutocompleteService = require('./search/autocomplete');
const OTPService = require('./otp/otpService');
const SessionStore = require('./sessions/sessionStore');
const DraftService = require('./drafts/draftService');
const AICache = require('./ai/aiCache');
const QueueManager = require('./queues/queueManager');
const keys = require('./utils/keys');

module.exports = {
  getRedisClient,
  closeRedis,
  cacheMiddleware,
  rateLimiter,
  QuestionCache,
  GeneralCache,
  LeaderboardService,
  AutocompleteService,
  OTPService,
  SessionStore,
  DraftService,
  AICache,
  QueueManager,
  keys
};
