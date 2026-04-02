import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

const registerUser = (userData) => request(app)
  .post('/api/auth/register')
  .send(userData);

const loginUser = (credentials) => request(app)
  .post('/api/auth/login')
  .send(credentials);

describe('Auth Routes', () => {
  // Run before all tests in this file
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  // Run after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Run after all tests in this file
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const res = await registerUser({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).not.toHaveProperty('password');
    });

    test('should fail to register with an existing email', async () => {
      await registerUser({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      });

      const res = await registerUser({
        name: 'Another User',
        email: 'existing@example.com',
        password: 'differentpassword',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('already exists');
    });

    test('should fail to register with missing required fields', async () => {
      const res = await registerUser({
        name: 'Incomplete User',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to register with missing email', async () => {
      const res = await registerUser({
        name: 'No Email User',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to register with missing password', async () => {
      const res = await registerUser({
        name: 'No Password User',
        email: 'nopass@example.com',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to register with invalid email format', async () => {
      const res = await registerUser({
        name: 'Invalid Email User',
        email: 'not-a-valid-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('valid email');
    });

    test('should normalize whitespace and uppercase email during registration', async () => {
      const res = await registerUser({
        name: '  Trimmed User  ',
        email: '  MIXEDCASE@Example.COM  ',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('name', 'Trimmed User');
      expect(res.body.user).toHaveProperty('email', 'mixedcase@example.com');
    });

    test('should store a hashed password instead of plain text', async () => {
      const plainPassword = 'password123';

      const res = await registerUser({
        name: 'Hashed User',
        email: 'hashed@example.com',
        password: plainPassword,
      });

      const storedUser = await User.findOne({ email: 'hashed@example.com' }).select('+password');

      expect(res.status).toBe(201);
      expect(storedUser.password).not.toBe(plainPassword);
      expect(storedUser.password.length).toBeGreaterThan(20);
    });

    test('should reject GET requests to register with a JSON 405 response', async () => {
      const res = await request(app).get('/api/auth/register');

      expect(res.status).toBe(405);
      expect(res.headers.allow).toBe('POST');
      expect(res.body.message).toContain('Method GET not allowed');
    });

  });

  describe('POST /api/auth/login', () => {
    test('should log in with correct credentials', async () => {
      await registerUser({
        name: 'Login Test User',
        email: 'login@example.com',
        password: 'password123',
      });

      const res = await loginUser({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'login@example.com');
      expect(res.body.user).toHaveProperty('name', 'Login Test User');
      expect(res.body.user).not.toHaveProperty('password');
    });

    test('should fail to log in with wrong password', async () => {
      await registerUser({
        name: 'Password Test User',
        email: 'wrongpass@example.com',
        password: 'correctpassword',
      });

      const res = await loginUser({
        email: 'wrongpass@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Invalid');
    });

    test('should fail to log in with non-existent email', async () => {
      const res = await loginUser({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid');
    });

    test('should fail to log in with missing email', async () => {
      const res = await loginUser({
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to log in with missing password', async () => {
      const res = await loginUser({
        email: 'user@example.com',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    test('should log in successfully with uppercase email input', async () => {
      await registerUser({
        name: 'Case Login User',
        email: 'caselogin@example.com',
        password: 'password123',
      });

      const res = await loginUser({
        email: '  CASELOGIN@EXAMPLE.COM ',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('email', 'caselogin@example.com');
    });

    test('should reject GET requests to login with a JSON 405 response', async () => {
      const res = await request(app).get('/api/auth/login');

      expect(res.status).toBe(405);
      expect(res.headers.allow).toBe('POST');
      expect(res.body.message).toContain('Method GET not allowed');
    });

  });

});
