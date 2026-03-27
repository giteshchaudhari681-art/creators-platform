import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

describe('Post Routes', () => {
  let authToken;
  let userId;
  let postId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // Create a test user
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test Creator',
        email: 'creator@example.com',
        password: 'password123'
      });

    userId = registerRes.body.data._id;

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'creator@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/posts (Create Post)', () => {
    test('should create a new post successfully', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'My First Post',
          description: 'This is my first post',
          content: 'This is the detailed content of my first post. It has more than 50 characters.'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'My First Post');
      expect(res.body.data).toHaveProperty('creator');
      postId = res.body.data._id;
    });

    test('should fail to create post without authentication', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Unauthorized Post',
          description: 'Should fail',
          content: 'This should not be created without authentication token'
        });

      expect(res.status).toBe(401);
    });

    test('should fail to create post with missing fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Post'
          // Missing description and content
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should fail to create post with short content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Short Post',
          description: 'Too short',
          content: 'Short' // Less than 50 characters
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts (Get All Posts)', () => {
    beforeEach(async () => {
      // Create test posts
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post 1',
          description: 'Description 1',
          content: 'This is the content of the first post with more than 50 characters for validation'
        });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post 2',
          description: 'Description 2',
          content: 'This is the content of the second post with more than 50 characters for validation'
        });
    });

    test('should retrieve all posts with authentication', async () => {
      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    test('should fail to retrieve posts without authentication', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/posts/:id (Get Single Post)', () => {
    test('should retrieve a single post by ID with authentication', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Single Post',
          description: 'Test single post retrieval',
          content: 'This is a long content string with more than 50 characters to pass validation checks'
        });

      const postIdToFetch = createRes.body.data._id;

      const res = await request(app)
        .get(`/api/posts/${postIdToFetch}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('_id', postIdToFetch);
      expect(res.body.data).toHaveProperty('title', 'Single Post');
    });

    test('should fail to get post without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/posts/${fakeId}`);
      expect(res.status).toBe(401);
    });

    test('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/posts/:id (Update Post)', () => {
    test('should update post successfully', async () => {
      // Create a post
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          description: 'Original Description',
          content: 'This is the original content with more than 50 characters required for validation purposes'
        });

      const postIdToUpdate = createRes.body.data._id;

      // Update the post
      const updateRes = await request(app)
        .put(`/api/posts/${postIdToUpdate}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
          content: 'This is the updated content with more than 50 characters required for validation purposes'
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data).toHaveProperty('title', 'Updated Title');
    });

    test('should fail to update without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/posts/${fakeId}`)
        .send({
          title: 'Unauthorized Update',
          description: 'Should fail',
          content: 'Should not update without authentication'
        });

      expect(res.status).toBe(401);
    });

    test('should return 404 when updating non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Non-existent Post',
          description: 'Does not exist',
          content: 'This post does not exist so update should fail with 404 error'
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/posts/:id (Delete Post)', () => {
    test('should delete post successfully', async () => {
      // Create a post
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post to Delete',
          description: 'This post will be deleted',
          content: 'This is the content of a post that will be deleted with more than 50 characters'
        });

      const postIdToDelete = createRes.body.data._id;

      // Delete the post
      const deleteRes = await request(app)
        .delete(`/api/posts/${postIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toHaveProperty('message');

      // Verify post is deleted
      const getRes = await request(app).get(`/api/posts/${postIdToDelete}`);
      expect(getRes.status).toBe(404);
    });

    test('should fail to delete without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/posts/${fakeId}`);

      expect(res.status).toBe(401);
    });

    test('should return 404 when deleting non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/posts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/posts/:id/like (Like Post)', () => {
    test('should like a post successfully', async () => {
      // Create a post
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post to Like',
          description: 'Like this post',
          content: 'This is a post that can be liked by authenticated users with more than 50 characters'
        });

      const postIdToLike = createRes.body.data._id;

      // Like the post
      const likeRes = await request(app)
        .post(`/api/posts/${postIdToLike}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 201]).toContain(likeRes.status);
    });

    test('should fail to like post without authentication', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).post(`/api/posts/${fakeId}/like`);

      expect(res.status).toBe(401);
    });
  });
});
