import prisma from '../config/database.js';
import logger from '../config/logger.js';

const getDashboardSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.userId,
      ...(startDate &&
        endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
    };

    const [totalExpenses, expenseCount, expenses] = await Promise.all([
      prisma.expense.aggregate({
        where,
        _sum: { amount: true }
      }),
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
          category: true
        }
      })
    ]);

    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {});

    const averageExpense = expenseCount > 0 ? (totalExpenses._sum.amount || 0) / expenseCount : 0;

    res.json({
      summary: {
        totalAmount: totalExpenses._sum.amount || 0,
        totalCount: expenseCount,
        averageExpense: parseFloat(averageExpense.toFixed(2)),
        categoryBreakdown
      }
    });
  } catch (error) {
    logger.logError(error, null, { context: 'dashboard-summary' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategoryAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.userId,
      ...(startDate &&
        endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
    };

    const expenses = await prisma.expense.findMany({
      where,
      select: {
        amount: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        }
      }
    });

    const analytics = expenses.reduce((acc, expense) => {
      const categoryId = expense.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName: expense.category.name,
          color: expense.category.color,
          icon: expense.category.icon,
          totalAmount: 0,
          count: 0
        };
      }
      acc[categoryId].totalAmount += expense.amount;
      acc[categoryId].count += 1;
      return acc;
    }, {});

    const categoryAnalytics = Object.values(analytics).map(item => ({
      ...item,
      averageAmount: parseFloat((item.totalAmount / item.count).toFixed(2))
    }));

    res.json({ categoryAnalytics });
  } catch (error) {
    logger.logError(error, null, { context: 'category-analytics' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      },
      orderBy: { date: 'asc' }
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(year, i).toLocaleString('default', { month: 'long' }),
      totalAmount: 0,
      count: 0
    }));

    expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      monthlyData[month].totalAmount += expense.amount;
      monthlyData[month].count += 1;
    });

    res.json({ trends: monthlyData });
  } catch (error) {
    logger.logError(error, null, { context: 'monthly-trends' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRecentExpenses = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
      take: parseInt(limit),
      include: {
        category: true
      }
    });

    res.json({ expenses });
  } catch (error) {
    logger.logError(error, null, { context: 'recent-expenses' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getDashboardSummary, getCategoryAnalytics, getMonthlyTrends, getRecentExpenses };
