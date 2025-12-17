# Default Categories Migration

This feature automatically creates default expense categories for users when
they sign up, and provides migration tools for existing users.

## Overview

### What It Does

1. **New User Registration**: Automatically creates 12 default categories when a
   user signs up (both local registration and Google OAuth)
2. **No Category**: Ensures all users have a "No Category" option for
   uncategorized expenses
3. **Orphan Expenses**: Provides tools to assign uncategorized expenses to "No
   Category"

### Default Categories Created

When a user signs up, the following categories are automatically created:

| Category          | Icon | Color  | Purpose                                 |
| ----------------- | ---- | ------ | --------------------------------------- |
| No Category       | 📋   | Gray   | Default for uncategorized expenses      |
| Food & Dining     | 🍔   | Red    | Restaurant, meals, food delivery        |
| Transportation    | 🚗   | Blue   | Gas, public transit, ride-sharing       |
| Shopping          | 🛍️   | Purple | Clothing, electronics, general shopping |
| Entertainment     | 🎬   | Pink   | Movies, games, subscriptions            |
| Bills & Utilities | 💡   | Orange | Electricity, water, internet, phone     |
| Healthcare        | ⚕️   | Green  | Medical, pharmacy, insurance            |
| Education         | 📚   | Cyan   | Courses, books, tuition                 |
| Travel            | ✈️   | Indigo | Flights, hotels, vacation               |
| Personal Care     | 💆   | Pink   | Salon, spa, hygiene products            |
| Groceries         | 🛒   | Lime   | Supermarket shopping                    |
| Other             | 📌   | Slate  | Miscellaneous expenses                  |

## Implementation Details

### Files Created/Modified

1. **`src/utils/defaultCategories.js`** - Core utility functions
   - `createDefaultCategories(userId)` - Creates all default categories
   - `getOrCreateNoCategory(userId)` - Ensures "No Category" exists
   - `assignNoCategoryToOrphanExpenses(userId)` - Fixes uncategorized expenses

2. **`src/controllers/authController.js`** - Updated to create categories on
   registration
3. **`src/config/passport.js`** - Updated to create categories for Google OAuth
   users

4. **`src/controllers/migrationController.js`** - Migration endpoints
   - `/api/v1/migration/default-categories` - Migrate all users
   - `/api/v1/migration/status` - Check migration status
   - `/api/v1/migration/fix-orphan-expenses` - Fix uncategorized expenses

5. **`src/routes/migrationRoutes.js`** - Migration routes

6. **`src/server.js`** - Added migration routes

## Migration for Existing Users

### Check Current Status

```bash
GET /api/v1/migration/status
Authorization: Bearer <token>
```

Response:

```json
{
  "users": {
    "total": 100,
    "withCategories": 45,
    "withoutCategories": 55,
    "withNoCategory": 40
  },
  "expenses": {
    "total": 1523
  },
  "categories": {
    "total": 540,
    "averagePerUser": "5.40"
  }
}
```

### Run Migration

```bash
POST /api/v1/migration/default-categories
Authorization: Bearer <token>
```

This will:

- Create default categories for users with no categories
- Add "No Category" to users who don't have it
- Assign orphan expenses to "No Category"

Response:

```json
{
  "success": true,
  "message": "Migration completed",
  "results": {
    "total": 100,
    "usersWithCategories": 45,
    "usersWithoutCategories": 55,
    "categoriesCreated": 660,
    "expensesUpdated": 23,
    "errors": []
  }
}
```

### Fix Orphan Expenses Only

If you only need to fix expenses without categories:

```bash
POST /api/v1/migration/fix-orphan-expenses
Authorization: Bearer <token>
```

## Security Considerations

⚠️ **Important**: The migration endpoints should be restricted to admin users in
production.

### Recommended Approach

1. Create an admin middleware:

```javascript
// src/middleware/admin.js
export const requireAdmin = (req, res, next) => {
  // Check if user is admin (implement your logic)
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

2. Update migration routes:

```javascript
import { requireAdmin } from '../middleware/admin.js';

router.post(
  '/default-categories',
  authenticate,
  requireAdmin,
  migrateDefaultCategories
);
router.post(
  '/fix-orphan-expenses',
  authenticate,
  requireAdmin,
  fixOrphanExpenses
);
```

## Testing

### Bruno API Collection

The migration endpoints are available in the Bruno API collection:

- `bruno-api-collection/Migration/Check Migration Status.bru`
- `bruno-api-collection/Migration/Migrate Default Categories.bru`
- `bruno-api-collection/Migration/Fix Orphan Expenses.bru`

### Manual Testing

1. **Test New Registration**:

   ```bash
   POST /api/v1/auth/register
   {
     "email": "test@example.com",
     "password": "password123",
     "name": "Test User"
   }
   ```

   Verify that 12 categories are created.

2. **Test Google OAuth**:
   - Sign up with Google
   - Check that default categories are created

3. **Test Migration**:
   - Create a test user manually without categories
   - Run migration endpoint
   - Verify categories are created

## Database Schema

No schema changes are required. The existing schema already supports this
feature:

```prisma
model Category {
  id        String    @id @default(uuid())
  name      String
  color     String?
  icon      String?
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses  Expense[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, name])
  @@index([userId])
  @@map("categories")
}
```

## Customization

To customize the default categories, edit `src/utils/defaultCategories.js`:

```javascript
export const DEFAULT_CATEGORIES = [
  { name: 'No Category', color: '#9CA3AF', icon: '📋' },
  { name: 'Your Custom Category', color: '#FF0000', icon: '🎯' }
  // Add more categories...
];
```

## Troubleshooting

### Categories Not Created for New Users

1. Check server logs for errors
2. Verify `createDefaultCategories` is called in registration flow
3. Check database transaction logs

### Migration Fails for Some Users

1. Check the `errors` array in migration response
2. Review user-specific logs
3. Verify database constraints (unique constraint on userId + name)

### Orphan Expenses Not Fixed

1. Verify the expense has an invalid categoryId
2. Check if "No Category" exists for the user
3. Review `assignNoCategoryToOrphanExpenses` logic

## Performance Considerations

- Migration runs synchronously for all users
- For large databases (1000+ users), consider running migration off-hours
- Consider adding pagination or batching for very large migrations
- Monitor database load during migration

## Future Improvements

- [ ] Add admin role/permission system
- [ ] Add background job queue for migrations
- [ ] Allow users to customize default categories
- [ ] Add category templates (business, personal, etc.)
- [ ] Track migration history
- [ ] Add rollback functionality
