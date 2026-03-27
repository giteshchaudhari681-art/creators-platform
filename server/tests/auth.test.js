import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

describe('Auth Routes', () => {
  
  // Run before all tests in this file
  beforeAll(async () => {
    // Connect to test database
    process.env.NODE_ENV = 'test';
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  // Run after each test
  afterEach(async () => {
    // Clear all users after each test to avoid data pollution
    await User.deleteMany({});
  });

  // Run after all tests in this file
  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    
    test('should register a new user successfully', async () => {
        const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
      expect(res.body.user).toHaveProperty('name', 'Test User');
    });

    test('should fail to register with an existing email', async () => {
      // First, create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'password123'
        });

      // Try to register again with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'existing@example.com',
          password: 'differentpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('already exists');
    });

    test('should fail to register with missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete User'
          // Missing email and password
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to register with missing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'No Email User',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to register with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'No Password User',
          email: 'nopass@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to register with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'not-a-valid-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('valid email');
    });

  });

  describe('POST /api/auth/login', () => {
    
    test('should log in with correct credentials', async () => {
      // First, register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'login@example.com',
          password: 'password123'
        });

      // Then log in
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'login@example.com');
      expect(res.body.user).toHaveProperty('name', 'Login Test User');
    });

    test('should fail to log in with wrong password', async () => {
      // Register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Password Test User',
          email: 'wrongpass@example.com',
          password: 'correctpassword'
        });

      // Try to log in with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongpass@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Invalid');
    });

    test('should fail to log in with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid');
    });

    test('should fail to log in with missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to log in with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

  });

});
