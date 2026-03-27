import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

const methodNotAllowed = (allowedMethods) => (req, res) => {
  res.set('Allow', allowedMethods.join(', '));
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed. Use ${allowedMethods.join(' or ')} for ${req.originalUrl}.`,
  });
};

// Registration route
router
  .route('/register')
  .post(registerUser)
  .all(methodNotAllowed(['POST']));

// Login route
router
  .route('/login')
  .post(loginUser)
  .all(methodNotAllowed(['POST']));

export default router;
