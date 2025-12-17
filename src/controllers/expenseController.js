import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import logger from '../config/logger.js';
import { getOrCreateNoCategory } from '../utils/defaultCategories.js';

const createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, categoryId, description, date, currency } = req.body;

    let finalCategoryId = categoryId;

    // If no category is provided, assign to "No Category"
    if (!categoryId) {
      finalCategoryId = await getOrCreateNoCategory(req.userId);
    } else {
      // Verify category exists and belongs to user
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: req.userId
        }
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        categoryId: finalCategoryId,
        description,
        date: date ? new Date(date) : new Date(),
        userId: req.userId
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    logger.logError(error, null, { context: 'create-expense' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.userId,
      ...(categoryId && { categoryId }),
      ...(startDate &&
        endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          category: true
        }
      }),
      prisma.expense.count({ where })
    ]);

    res.json({
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.logError(error, null, { context: 'get-expenses' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        category: true
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense });
  } catch (error) {
    logger.logError(error, null, { context: 'get-expense-by-id' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, amount, categoryId, description, date, currency } = req.body;

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // If categoryId is being updated, verify it exists and belongs to user
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: req.userId
        }
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(currency && { currency }),
        ...(categoryId && { categoryId }),
        ...(description !== undefined && { description }),
        ...(date && { date: new Date(date) })
      },
      include: {
        category: true
      }
    });

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    logger.logError(error, null, { context: 'update-expense' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({
      where: { id }
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    logger.logError(error, null, { context: 'delete-expense' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
