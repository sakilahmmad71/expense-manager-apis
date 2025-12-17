import prisma from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Default categories to be created for new users
 */
export const DEFAULT_CATEGORIES = [
  { name: 'No Category', color: '#9CA3AF', icon: '📋' },
  { name: 'Food & Dining', color: '#EF4444', icon: '🍔' },
  { name: 'Transportation', color: '#3B82F6', icon: '🚗' },
  { name: 'Shopping', color: '#8B5CF6', icon: '🛍️' },
  { name: 'Entertainment', color: '#EC4899', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#F59E0B', icon: '💡' },
  { name: 'Healthcare', color: '#10B981', icon: '⚕️' },
  { name: 'Education', color: '#06B6D4', icon: '📚' },
  { name: 'Travel', color: '#6366F1', icon: '✈️' },
  { name: 'Personal Care', color: '#EC4899', icon: '💆' },
  { name: 'Groceries', color: '#84CC16', icon: '🛒' },
  { name: 'Other', color: '#64748B', icon: '📌' }
];

/**
 * Create default categories for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} Object containing noCategoryId and all created categories
 */
export const createDefaultCategories = async (userId) => {
  try {
    const createdCategories = await prisma.$transaction(
      DEFAULT_CATEGORIES.map(category =>
        prisma.category.create({
          data: {
            name: category.name,
            color: category.color,
            icon: category.icon,
            userId
          }
        })
      )
    );

    // Find the "No Category" entry
    const noCategoryEntry = createdCategories.find(cat => cat.name === 'No Category');

    logger.info(
      `Created ${createdCategories.length} default categories for user ${userId}`,
      { userId, categoriesCount: createdCategories.length }
    );

    return {
      noCategoryId: noCategoryEntry?.id,
      categories: createdCategories
    };
  } catch (error) {
    logger.logError(error, null, {
      context: 'create-default-categories',
      userId
    });
    throw error;
  }
};

/**
 * Get or create "No Category" for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<string>} The "No Category" ID
 */
export const getOrCreateNoCategory = async (userId) => {
  try {
    // Try to find existing "No Category"
    let noCategory = await prisma.category.findFirst({
      where: {
        userId,
        name: 'No Category'
      }
    });

    // If not found, create it
    if (!noCategory) {
      noCategory = await prisma.category.create({
        data: {
          name: 'No Category',
          color: '#9CA3AF',
          icon: '📋',
          userId
        }
      });
      logger.info(`Created "No Category" for user ${userId}`, { userId });
    }

    return noCategory.id;
  } catch (error) {
    logger.logError(error, null, {
      context: 'get-or-create-no-category',
      userId
    });
    throw error;
  }
};

/**
 * Assign "No Category" to all expenses without a category for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<number>} Number of expenses updated
 */
export const assignNoCategoryToOrphanExpenses = async (userId) => {
  try {
    const noCategoryId = await getOrCreateNoCategory(userId);

    // Find all expenses for this user that reference non-existent categories
    // or have invalid category IDs
    const userExpenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true }
    });

    // Filter expenses without valid categories
    const orphanExpenses = userExpenses.filter(expense => !expense.category);

    if (orphanExpenses.length === 0) {
      return 0;
    }

    // Update all orphan expenses to use "No Category"
    const updateResult = await prisma.expense.updateMany({
      where: {
        id: { in: orphanExpenses.map(e => e.id) }
      },
      data: {
        categoryId: noCategoryId
      }
    });

    logger.info(
      `Assigned "No Category" to ${updateResult.count} expenses for user ${userId}`,
      { userId, updatedCount: updateResult.count }
    );

    return updateResult.count;
  } catch (error) {
    logger.logError(error, null, {
      context: 'assign-no-category-to-orphan-expenses',
      userId
    });
    throw error;
  }
};
