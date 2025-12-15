import express from 'express';
import {
  getDashboardSummary,
  getCategoryAnalytics,
  getMonthlyTrends,
  getRecentExpenses
} from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/category-analytics', getCategoryAnalytics);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/recent-expenses', getRecentExpenses);

export default router;
