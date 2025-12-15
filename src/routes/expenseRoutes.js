import express from 'express';
import { body } from 'express-validator';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('categoryId')
      .notEmpty()
      .withMessage('Category ID is required')
      .isUUID()
      .withMessage('Category ID must be a valid UUID')
  ],
  createExpense
);

router.get('/', getExpenses);

router.get('/:id', getExpenseById);

router.put(
  '/:id',
  [body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number')],
  updateExpense
);

router.delete('/:id', deleteExpense);

export default router;
