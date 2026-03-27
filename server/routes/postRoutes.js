import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController.js';

const postRoutes = (io) => {

  const router = express.Router();

  router.post('/', protect, async (req, res) => {
    await createPost(req, res);

    if (res.statusCode === 201) {
      io.emit('newPost', {
        message: `New post created by ${req.user.name}`
      });
    }
  });

  router.get('/', protect, getPosts);

  router.get('/:id', protect, getPostById);

  router.put('/:id', protect, updatePost);

  router.delete('/:id', protect, deletePost);

  router.post('/:id/like', protect, likePost);

  return router;

};

export default postRoutes;
