import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import logger from '../config/logger.js';

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, color, icon } = req.body;

    // Check if category with same name already exists for this user
    const existingCategory = await prisma.category.findUnique({
      where: {
        userId_name: {
          userId: req.userId,
          name
        }
      }
    });

    if (existingCategory) {
      return res.status(409).json({
        error: 'Category with this name already exists'
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        color,
        icon,
        userId: req.userId
      }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    logger.logError(error, null, { context: 'create-category' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: {
          userId: req.userId
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          name: 'asc'
        },
        include: {
          _count: {
            select: { expenses: true }
          }
        }
      }),
      prisma.category.count({
        where: {
          userId: req.userId
        }
      })
    ]);

    res.json({
      categories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.logError(error, null, { context: 'get-categories' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        _count: {
          select: { expenses: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    logger.logError(error, null, { context: 'get-category-by-id' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, color, icon } = req.body;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if new name conflicts with another category
    if (name && name !== existingCategory.name) {
      const nameConflict = await prisma.category.findUnique({
        where: {
          userId_name: {
            userId: req.userId,
            name
          }
        }
      });

      if (nameConflict) {
        return res.status(409).json({
          error: 'Category with this name already exists'
        });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon })
      }
    });

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    logger.logError(error, null, { context: 'update-category' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        _count: {
          select: { expenses: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has associated expenses
    if (category._count.expenses > 0) {
      return res.status(409).json({
        error: 'Cannot delete category with associated expenses',
        expenseCount: category._count.expenses
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    logger.logError(error, null, { context: 'delete-category' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
