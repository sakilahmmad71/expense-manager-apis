# Expense Manager API

A comprehensive REST API for managing expenses with authentication, authorization, and analytics.

## Features

- 🔐 **Authentication & Authorization** - JWT-based user authentication with secure password hashing
- 👤 **User Profile Management** - Update user information (name, email, password)
- 💰 **Expense Management** - Full CRUD operations with advanced filtering and pagination
- 🏷️ **Category Management** - Custom categories with colors, icons, and full CRUD operations
- 📊 **Dashboard Analytics** - Summary statistics, category breakdown, monthly trends, and recent expenses
- 🔍 **Advanced Filtering** - Filter expenses by category, date range, with sorting and pagination
- 📈 **Bulk Operations** - Efficient handling of multiple records
- 🗄️ **PostgreSQL Database** - Robust data storage with Prisma ORM
- 📝 **Structured Logging** - JSON-based logging with Winston for comprehensive request tracking
- 🏥 **Health Checks** - Detailed health monitoring endpoints
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose

## Tech Stack

- **Node.js** & **Express.js** - Backend framework
- **Prisma** - Modern database ORM with type safety
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Secure authentication
- **bcryptjs** - Password hashing
- **Winston** - Structured logging
- **Docker** & **Docker Compose** - Containerization
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

### Installation

1. Clone the repository

```bash
cd expense-manager-apis
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and update the values:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

4. Generate Prisma Client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server

```bash
npm run dev
```

## Docker Deployment

### Production

```bash
docker-compose up -d
```

### Development (with hot reload)

```bash
docker-compose -f docker-compose.dev.yml up
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (protected)
- `PUT /api/v1/auth/profile` - Update user profile (protected)
  - Update name, email, and/or password
  - Email uniqueness validation
  - Optional password change

### Expenses

- `POST /api/v1/expenses` - Create new expense
- `GET /api/v1/expenses` - Get all expenses with pagination and filters
  - Query params: `page`, `limit`, `category`, `startDate`, `endDate`
  - Returns paginated results with metadata
- `GET /api/v1/expenses/:id` - Get single expense by ID
- `PUT /api/v1/expenses/:id` - Full update of expense
- `PATCH /api/v1/expenses/:id` - Partial update of expense
- `DELETE /api/v1/expenses/:id` - Delete expense

### Categories

- `POST /api/v1/categories` - Create new category
  - Fields: `name` (required), `color`, `icon`
- `GET /api/v1/categories` - Get all categories with pagination
  - Query params: `page`, `limit`
- `GET /api/v1/categories/:id` - Get single category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Dashboard

- `GET /api/v1/dashboard/summary` - Get expense summary with stats
  - Query params: `startDate`, `endDate`
  - Returns: totalAmount, totalCount, averageExpense, categoryBreakdown
- `GET /api/v1/dashboard/category-analytics` - Get detailed category analytics
  - Query params: `startDate`, `endDate`
  - Returns: per-category totals, counts, and averages
- `GET /api/v1/dashboard/monthly-trends` - Get monthly spending trends
  - Query params: `year`
  - Returns: 12-month breakdown with totals
- `GET /api/v1/dashboard/recent-expenses` - Get recent expenses
  - Query params: `limit` (default: 5)

### Health

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health status with database connection

## API Documentation

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Update Profile (requires authentication)

```bash
curl -X PUT http://localhost:3000/api/v1/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "newpassword123"
  }'
```

Note: All fields are optional. Only provide fields you want to update.

### Create Category (requires authentication)

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Food",
    "color": "#3b82f6",
    "icon": "🍔"
  }'
```

### Create Expense (requires authentication)

```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Groceries",
    "amount": 45.50,
    "categoryId": "category-uuid-here",
    "description": "Weekly grocery shopping",
    "date": "2025-12-09"
  }'
```

### Get Expenses (with filters)

```bash
curl -X GET "http://localhost:3000/api/v1/expenses?page=1&limit=10&category=Food&startDate=2025-12-01&endDate=2025-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Dashboard Summary

```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/summary?startDate=2025-12-01&endDate=2025-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

| Variable            | Description                          | Default     |
| ------------------- | ------------------------------------ | ----------- |
| `DATABASE_URL`      | PostgreSQL connection string         | -           |
| `POSTGRES_USER`     | Database user                        | expenseuser |
| `POSTGRES_PASSWORD` | Database password                    | expensepass |
| `POSTGRES_DB`       | Database name                        | expensedb   |
| `POSTGRES_PORT`     | Database port                        | 5432        |
| `JWT_SECRET`        | Secret key for JWT                   | -           |
| `PORT`              | API server port                      | 3000        |
| `NODE_ENV`          | Environment (development/production) | development |

## Database Schema

### User

- `id` (UUID, Primary Key)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `name` (String, required)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- Relations: One-to-many with Expense and Category

### Category

- `id` (UUID, Primary Key)
- `name` (String, required)
- `color` (String, optional) - Hex color code
- `icon` (String, optional) - Emoji or icon identifier
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- Relations: Many-to-one with User, One-to-many with Expense

### Expense

- `id` (UUID, Primary Key)
- `title` (String, required)
- `amount` (Decimal, required)
- `description` (String, optional)
- `date` (DateTime, required)
- `categoryId` (UUID, Foreign Key)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- Relations: Many-to-one with User and Category

## Scripts

- `npm run dev` - Start development server with hot reload (nodemon)
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations (development)
- `npm run prisma:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run prisma:seed` - Seed database with initial data

## Key Features

### Authentication & Security

- JWT-based authentication with Bearer tokens
- Password hashing with bcryptjs (10 rounds)
- Protected routes with middleware
- Email uniqueness validation
- Secure password update flow

### Advanced Filtering

- Expenses: Filter by category, date range, with pagination
- Categories: Pagination support
- Dashboard: Date range filtering for all analytics
- Sorting: By date or amount (ascending/descending)

### Structured Logging

- JSON-formatted logs with Winston
- Request/response logging with metadata
- Separate error logging
- Timestamps and log levels
- Production-ready log rotation

### API Response Format

All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "data": { ... },
  "pagination": { // if applicable
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

Error responses:

```json
{
	"success": false,
	"error": "Error message"
}
```

## Documentation & Testing

### Bruno API Collection

A complete Bruno API collection is available in the `bruno-api-collection/` directory:

- **Auth**: Register, Login, Get Profile, Update Profile
- **Categories**: Full CRUD operations
- **Expenses**: Full CRUD operations with filters
- **Dashboard**: Summary, Analytics, Trends, Recent Expenses
- **Health**: Basic and detailed health checks

To use:

1. Install [Bruno](https://www.usebruno.com/)
2. Open the `bruno-api-collection` folder
3. Configure environment variables (local/production)
4. Run requests

### Additional Documentation

- [Category API Documentation](./CATEGORY_API.md) - Detailed category endpoints
- [Logging Documentation](./LOGGING.md) - Structured logging setup
- [Bruno Collection README](./bruno-api-collection/README.md) - API testing guide

## Project Structure

```
expense-manager-apis/
├── src/
│   ├── server.js              # Main application entry
│   ├── config/
│   │   ├── database.js        # Prisma client setup
│   │   └── logger.js          # Winston logger config
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   ├── categoryController.js  # Category CRUD
│   │   ├── expenseController.js   # Expense CRUD
│   │   ├── dashboardController.js # Analytics
│   │   └── healthController.js    # Health checks
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── logging.js         # Request logging
│   └── routes/
│       ├── authRoutes.js
│       ├── categoryRoutes.js
│       ├── expenseRoutes.js
│       ├── dashboardRoutes.js
│       └── healthRoutes.js
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
├── bruno-api-collection/      # Bruno API tests
├── logs/                      # Application logs
├── Dockerfile                 # Production image
├── Dockerfile.dev             # Development image
├── docker-compose.yml         # Production setup
├── docker-compose.dev.yml     # Development setup
└── Makefile                   # Common commands
```

## Recent Improvements

### Features Added

- ✅ User profile update API (PUT /auth/profile)
- ✅ Category management system with colors and icons
- ✅ Category analytics with date filtering
- ✅ Partial update for expenses (PATCH)
- ✅ Enhanced dashboard with monthly trends
- ✅ Health check endpoints
- ✅ Bruno API collection for testing

### Database Updates

- ✅ Added Category model with user relationship
- ✅ Updated Expense model with categoryId foreign key
- ✅ Migration from category string to Category relation

### Security & Validation

- ✅ Email uniqueness validation on profile update
- ✅ Optional password change in profile update
- ✅ Enhanced error handling and logging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- **Frontend App**: [expense-manager-app](../expense-manager-app)
- **GitHub**: [https://github.com/sakilahmmad71](https://github.com/sakilahmmad71)
- **LinkedIn**: [https://linkedin.com/in/sakilahmmad71](https://linkedin.com/in/sakilahmmad71)

## Acknowledgments

Built with ❤️ as an open-source project for the community.
