import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  googleCallback,
  googleFailure
} from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

// Local authentication routes
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/google/failure',
    session: false
  }),
  googleCallback
);

router.get('/google/failure', googleFailure);

// Profile routes
router.get('/profile', authMiddleware, getProfile);

router.put(
  '/profile',
  authMiddleware,
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty')
  ],
  updateProfile
);

export default router;
