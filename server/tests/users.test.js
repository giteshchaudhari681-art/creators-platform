import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

const registerUser = (userData) => request(app)
  .post('/api/users/register')
  .send(userData);

describe('User Routes', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();

    const registerRes = await registerUser({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    userId = registerRes.body.data._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    authToken = loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({ _id: { $ne: userId } });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/users/register', () => {
    test('should register a new user with valid data', async () => {
      const res = await registerUser({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('email', 'newuser@example.com');
      expect(res.body.data).toHaveProperty('name', 'New User');
      expect(res.body.data).not.toHaveProperty('password');
    });

    test('should reject duplicate email registration', async () => {
      await registerUser({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      const res = await registerUser({
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already exists');
    });

    test('should validate email format', async () => {
      const res = await registerUser({
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('valid email');
    });

    test('should require minimum password length', async () => {
      const res = await registerUser({
        name: 'Short Password User',
        email: 'shortpass@example.com',
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('at least 6 characters');
    });

    test('should trim whitespace in fields', async () => {
      const res = await registerUser({
        name: '  Trimmed User  ',
        email: '  trimmed@example.com  ',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Trimmed User');
      expect(res.body.data.email).toBe('trimmed@example.com');
    });
  });

  describe('GET /api/users', () => {
    test('should require authentication to get users list', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });

    test('should return users list with a valid token', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should request user by ID with valid token', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('_id', userId.toString());
      expect(res.body.data).not.toHaveProperty('password');
    });

    test('should return error for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    test('should fail without authentication', async () => {
      const res = await request(app).get(`/api/users/${userId}`);
      expect(res.status).toBe(401);
    });

    test('should handle invalid user ID format', async () => {
      const res = await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should fail to update without authentication', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          name: 'Unauthorized Update',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should fail to delete without authentication', async () => {
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.status).toBe(401);
    });
  });

  describe('User Data Validation', () => {
    test('should require name with minimum length', async () => {
      const res = await registerUser({
        name: 'A',
        email: 'minname@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
    });

    test('should reject overly long names', async () => {
      const longName = 'A'.repeat(51);
      const res = await registerUser({
        name: longName,
        email: 'longname@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
    });
  });
});
