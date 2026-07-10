const express = require('express');
const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./setup');
const problemsRoutes = require('../routes/problems');
const ProblemMetadata = require('../models/ProblemMetadata');

// Mock Redis caching middleware to simply call next() during tests
jest.mock('../redis', () => ({
  cacheMiddleware: () => (req, res, next) => next(),
  keys: { questionsList: () => 'mockKey' }
}));

const app = express();
app.use(express.json());
app.use('/api/problems', problemsRoutes);

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await teardownDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('Problems Routes', () => {
  describe('GET /api/problems', () => {
    it('should fetch published problems successfully', async () => {
      // Seed some problems
      await ProblemMetadata.create([
        { title: 'Test 1', slug: 'test-1', difficulty: 'Easy', categories: ['Arrays'], visibility: 'Published' },
        { title: 'Test 2', slug: 'test-2', difficulty: 'Medium', categories: ['Math'], visibility: 'Published' },
        { title: 'Test 3', slug: 'test-3', difficulty: 'Hard', categories: ['DP'], visibility: 'Draft' }, // Should be hidden
      ]);

      const res = await request(app).get('/api/problems');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.total).toBe(2);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data.map(p => p.title)).toContain('Test 1');
      expect(res.body.data.map(p => p.title)).toContain('Test 2');
    });

    it('should paginate correctly', async () => {
      // Create 25 problems
      const problems = Array.from({ length: 25 }).map((_, i) => ({
        title: `P${i}`,
        slug: `p-${i}`,
        difficulty: 'Easy',
        visibility: 'Published'
      }));
      await ProblemMetadata.insertMany(problems);

      // Default limit is 20
      const page1 = await request(app).get('/api/problems?page=1');
      expect(page1.body.data).toHaveLength(20);
      expect(page1.body.total).toBe(25);

      const page2 = await request(app).get('/api/problems?page=2');
      expect(page2.body.data).toHaveLength(5);
    });
  });
});
