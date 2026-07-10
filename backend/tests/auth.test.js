const express = require('express');
const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./setup');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

// Mock Redis dependent services
jest.mock('../services/otpService', () => ({
  sendOTP: jest.fn().mockResolvedValue(true),
  verifyOTP: jest.fn().mockResolvedValue(true),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await teardownDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register/send-otp', () => {
    it('should send an OTP successfully for a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register/send-otp')
        .send({ email: 'test@example.com' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('OTP sent successfully');
    });

    it('should fail if email is not provided', async () => {
      const res = await request(app)
        .post('/api/auth/register/send-otp')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if user already exists', async () => {
      // Create a dummy user
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
      });
      await user.save({ validateBeforeSave: false }); // Skip full validation for quick setup

      const res = await request(app)
        .post('/api/auth/register/send-otp')
        .send({ email: 'test@example.com' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email already registered');
    });
  });
});
