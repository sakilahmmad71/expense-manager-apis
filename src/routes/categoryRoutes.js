import express from 'express';
import { body } from 'express-validator';
import categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('name')
      .notEmpty()
      .withMessage('Category name is required')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Category name must be between 1 and 50 characters'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color must be a valid hex color code (e.g., #FF5733)'),
    body('icon')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Icon must be less than 50 characters')
  ],
  categoryController.createCategory
);

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.put(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Category name must be between 1 and 50 characters'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color must be a valid hex color code (e.g., #FF5733)'),
    body('icon')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Icon must be less than 50 characters')
  ],
  categoryController.updateCategory
);

router.delete('/:id', categoryController.deleteCategory);

export default router;
