#!/usr/bin/env node

/**
 * Migration Script for Default Categories
 *
 * This script creates default categories for all existing users
 * and assigns "No Category" to orphan expenses.
 *
 * Usage:
 *   node scripts/migrate-default-categories.js
 */

import 'dotenv/config';
import prisma from '../src/config/database.js';
import logger from '../src/config/logger.js';
import {
  createDefaultCategories,
  assignNoCategoryToOrphanExpenses
} from '../src/utils/defaultCategories.js';

async function runMigration() {
  console.log('🚀 Starting default categories migration...\n');

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log(`📊 Found ${users.length} users\n`);

    const results = {
      total: users.length,
      usersWithCategories: 0,
      usersWithoutCategories: 0,
      categoriesCreated: 0,
      expensesUpdated: 0,
      errors: []
    };

    let processed = 0;

    for (const user of users) {
      processed++;
      process.stdout.write(`\rProcessing user ${processed}/${users.length}...`);

      try {
        // Check if user already has categories
        if (user.categories.length === 0) {
          // User has no categories, create default ones
          const { categories } = await createDefaultCategories(user.id);
          results.usersWithoutCategories++;
          results.categoriesCreated += categories.length;
        } else {
          // Check if user has "No Category"
          const hasNoCategory = user.categories.some(cat => cat.name === 'No Category');

          if (!hasNoCategory) {
            // Create only "No Category" for this user
            await prisma.category.create({
              data: {
                name: 'No Category',
                color: '#9CA3AF',
                icon: '📋',
                userId: user.id
              }
            });
            results.categoriesCreated++;
          }

          results.usersWithCategories++;
        }

        // Assign orphan expenses to "No Category"
        const updatedCount = await assignNoCategoryToOrphanExpenses(user.id);
        results.expensesUpdated += updatedCount;

      } catch (error) {
        logger.logError(error, null, {
          context: 'migrate-user-categories-script',
          userId: user.id
        });
        results.errors.push({
          userId: user.id,
          email: user.email,
          name: user.name,
          error: error.message
        });
      }
    }

    console.log('\n\n✅ Migration completed!\n');
    console.log('📈 Results:');
    console.log(`   Total users: ${results.total}`);
    console.log(`   Users with categories: ${results.usersWithCategories}`);
    console.log(`   Users without categories: ${results.usersWithoutCategories}`);
    console.log(`   Categories created: ${results.categoriesCreated}`);
    console.log(`   Expenses updated: ${results.expensesUpdated}`);

    if (results.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${results.errors.length}`);
      results.errors.forEach(err => {
        console.log(`   - ${err.email} (${err.name}): ${err.error}`);
      });
    }

    console.log('\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    logger.logError(error, null, { context: 'migrate-default-categories-script' });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
runMigration();
