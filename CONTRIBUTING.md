# Contributing to Expenser API

Thank you for your interest in contributing to Expenser API! We appreciate your
time and effort in helping improve this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code. Please report unacceptable
behavior to sakilahmmad71@gmail.com.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.
When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this feature would be useful
- Include examples or mockups if applicable

### Code Contributions

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Setup Steps

1. **Fork and Clone**

```bash
git clone https://github.com/YOUR_USERNAME/expense-manager-apis.git
cd expense-manager-apis
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Set Up Environment**

```bash
# Copy example environment file
cp .env.example .env.development

# Edit .env.development with your local settings
```

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/expenser?schema=public"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
LOG_LEVEL="debug"
```

4. **Start Database (Docker)**

```bash
docker-compose -f docker-compose.development.yml up -d postgres
```

5. **Run Migrations**

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

6. **Start Development Server**

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## 🔄 Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-payment-methods`
- `fix/category-validation-error`
- `docs/update-api-documentation`
- `refactor/improve-error-handling`

### Testing Your Changes

1. **Manual Testing**
   - Test all affected endpoints using the Bruno API collection in
     `bruno-api-collection/`
   - Verify error handling and edge cases

2. **Database Changes**
   - If you modify the Prisma schema, create a migration:

   ```bash
   pnpm prisma migrate dev --name descriptive-migration-name
   ```

3. **Check Logs**
   - Monitor Winston logs for any warnings or errors
   - Ensure structured logging is maintained

### Running with Docker

```bash
# Development
make dev

# Check logs
docker-compose -f docker-compose.development.yml logs -f api
```

## 📝 Coding Standards

### Code Style

- Use **ES6+ features** (async/await, destructuring, etc.)
- Follow **consistent indentation** (2 spaces)
- Use **meaningful variable and function names**
- Add **JSDoc comments** for complex functions
- Keep functions **small and focused**

### File Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── routes/         # API routes
├── utils/          # Utility functions
└── server.js       # Entry point
```

### API Design Principles

- Follow **RESTful conventions**
- Use proper **HTTP status codes**
- Return **consistent JSON responses**
- Implement **proper error handling**
- Add **input validation** using express-validator
- Include **pagination** for list endpoints

### Example Response Format

```javascript
// Success Response
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "details": [ /* validation errors */ ]
}
```

### Database Best Practices

- Use **Prisma migrations** for schema changes
- Add **appropriate indexes** for query performance
- Use **transactions** for multi-step operations
- Follow **naming conventions** (camelCase for fields)

## 💬 Commit Messages

Write clear, concise commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(expenses): add bulk delete endpoint

Implement endpoint to delete multiple expenses at once.
Includes validation and transaction support.

Closes #42
```

```
fix(auth): handle expired JWT tokens properly

Add proper error handling for expired tokens and
return appropriate status code.
```

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Test your changes thoroughly
2. ✅ Update documentation if needed
3. ✅ Ensure no console errors or warnings
4. ✅ Update the README if adding new features
5. ✅ Add or update API examples in Bruno collection

### PR Guidelines

1. **Create a descriptive PR title**
   - ✅ `Add payment method filtering`
   - ❌ `Update code`

2. **Fill out the PR template** with:
   - Description of changes
   - Related issue(s)
   - Testing performed
   - Screenshots (if UI changes)

3. **Keep PRs focused**
   - One feature/fix per PR
   - Avoid unrelated changes

4. **Respond to feedback**
   - Address review comments promptly
   - Be open to suggestions

### PR Review Process

1. Automated checks must pass
2. At least one maintainer approval required
3. No unresolved conversations
4. Branch must be up-to-date with `main`

## 🐛 Reporting Bugs

Use the **Bug Report** issue template and include:

- **Description**: Clear summary of the bug
- **Steps to Reproduce**: Numbered steps to recreate
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, etc.
- **Logs**: Relevant error messages or logs

## 💡 Suggesting Features

Use the **Feature Request** issue template and include:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: Your suggested implementation
- **Alternatives**: Other approaches considered
- **Additional Context**: Any relevant information

## 🔒 Security

If you discover a security vulnerability, please email sakilahmmad71@gmail.com
directly instead of creating a public issue. See [SECURITY.md](SECURITY.md) for
details.

## 📚 Additional Resources

- [API Documentation](README.md)
- [Bruno API Collection](bruno-api-collection/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)

## 🎉 Recognition

Contributors will be acknowledged in the README and release notes. Thank you for
helping make Expenser better!

## 📧 Contact

- **Maintainer**: Shakil Ahmed
- **Email**: sakilahmmad71@gmail.com
- **GitHub**: [@sakilahmmad71](https://github.com/sakilahmmad71)

---

Happy Contributing! 🚀
