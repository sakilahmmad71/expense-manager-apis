# Changelog

All notable changes to the Expense Manager API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open source preparation with community health files
- GitHub issue and pull request templates
- CI/CD workflow with GitHub Actions
- Code quality tools (ESLint, Prettier)
- Automated dependency updates with Dependabot
- Security policy for vulnerability reporting

### Changed

- Enhanced project metadata for better discoverability

## [1.0.0] - 2025-12-15

### Added

- 🔐 JWT-based authentication and authorization system
- 👤 User profile management (registration, login, profile updates)
- 💰 Complete expense CRUD operations with validation
- 💱 Multi-currency support (USD, EUR, GBP, JPY, INR, BDT, etc.)
- 🏷️ Category management with custom colors and icons
- 📊 Comprehensive dashboard analytics
  - Summary statistics (total expenses, income, balance)
  - Category breakdown with percentages
  - Monthly trends analysis
  - Recent expenses tracking
- 🔍 Advanced filtering and sorting capabilities
- 📈 Bulk operations support
- 🗄️ PostgreSQL database with Prisma ORM
- 📝 Structured JSON logging with Winston
- 🏥 Health check endpoints (basic and detailed)
- 🐳 Docker support with development and production configurations
- 📋 Comprehensive Makefile for easy development workflow
- 🧪 Complete Bruno API collection for testing
- 📖 Extensive documentation (README, CONTRIBUTING, ARCHITECTURE)

### Security

- Password hashing with bcryptjs
- Input validation with express-validator
- SQL injection prevention via Prisma ORM
- CORS configuration
- JWT token expiration and validation
- Environment variable security practices

### Infrastructure

- Docker containerization
- Multi-environment configuration
- Database migrations
- Structured logging
- Error handling middleware
- Request logging with Morgan

[Unreleased]:
  https://github.com/sakilahmmad71/expense-manager-apis/compare/v1.0.0...HEAD
[1.0.0]:
  https://github.com/sakilahmmad71/expense-manager-apis/releases/tag/v1.0.0
