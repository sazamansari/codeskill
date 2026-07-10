const express = require('express');
const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./setup');

// Mock auth middleware for testing
jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => {
    req.user = { _id: '64e8e1234567890123456789', email: 'test@example.com' };
    next();
  }
}));

const companyRoutes = require('../routes/company');
const User = require('../models/User');
const Company = require('../models/Company');

const app = express();
app.use(express.json());
app.use('/api/company', companyRoutes);

// Mock auth middleware for testing
// Removed mock as it's now handled by middleware above

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await teardownDB());

describe('Company Routes', () => {
  it('should register a new company', async () => {
    const res = await request(app)
      .post('/api/company')
      .send({
        name: 'Test Corp',
        username: 'testcorp',
        website: 'https://testcorp.com',
        description: 'A testing company'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.company.name).toEqual('Test Corp');
  });

  it('should get my companies', async () => {
    // Need to seed DB for this to work perfectly, but we can test the structure
    const res = await request(app).get('/api/company/my-companies');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(Array.isArray(res.body.companies)).toBeTruthy();
  });
});
