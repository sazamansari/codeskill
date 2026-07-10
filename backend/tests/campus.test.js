const express = require('express');
const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./setup');

jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => {
    req.user = { _id: '64e8e1234567890123456789', email: 'test@campus.edu' };
    next();
  }
}));

const campusRoutes = require('../routes/campus');

const app = express();
app.use(express.json());
app.use('/api/campus', campusRoutes);

// Removed mock

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await teardownDB());

describe('Campus Routes', () => {
  it('should register a new university', async () => {
    const res = await request(app)
      .post('/api/campus')
      .send({
        name: 'Test University',
        username: 'testuni',
        domain: 'testuni.edu',
        website: 'https://testuni.edu'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.university.name).toEqual('Test University');
    expect(res.body.university.domain).toEqual('testuni.edu');
  });

  it('should fail if username already exists', async () => {
    // First registration
    await request(app).post('/api/campus').send({
      name: 'Test University',
      username: 'testuni',
      domain: 'testuni.edu'
    });

    // Second registration with same username
    const res = await request(app).post('/api/campus').send({
      name: 'Another University',
      username: 'testuni',
      domain: 'another.edu'
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toContain('already exists');
  });
});
