# Support

Looking for help with the Expenser API? Here are the best ways to get support:

## 📚 Documentation

Before reaching out, please check our comprehensive documentation:

- **[README.md](README.md)** - Complete setup and API documentation
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and
  development setup
- **[SECURITY.md](SECURITY.md)** - Security guidelines and reporting
  vulnerabilities
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and changes

## 🐛 Issues and Bugs

If you've found a bug or are experiencing issues:

1. **Search existing issues** first to avoid duplicates
2. **Create a new issue** using our templates:
   - [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) - For reporting bugs
   - [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) - For
     suggesting improvements
   - [Question](.github/ISSUE_TEMPLATE/question.md) - For asking questions

## 💬 Community Support

- **[GitHub Discussions](https://github.com/sakilahmmad71/expense-manager-apis/discussions)** -
  Ask questions, share ideas, and get community help
- **[GitHub Issues](https://github.com/sakilahmmad71/expense-manager-apis/issues)** -
  Report bugs or request features

## 📧 Direct Contact

For sensitive issues (e.g., security vulnerabilities), please email:

- **Email**: [sakilahmmad71@gmail.com](mailto:sakilahmmad71@gmail.com)
- **Security Reports**: See [SECURITY.md](SECURITY.md)

## 🚀 Quick Help

### Common Issues

**Database Connection Issues**

- Verify PostgreSQL is running
- Check `.env` file configuration
- Ensure `DATABASE_URL` is correct
- Run `make dev-logs` to check error logs

**Authentication Errors**

- Verify `JWT_SECRET` is set in `.env`
- Check token expiration settings
- Ensure Bearer token format in requests

**API Not Starting**

- Check if port 3000 is available
- Verify all dependencies are installed: `pnpm install`
- Check Docker containers: `make dev-status`

### Development Help

**Running the API**

```bash
# Development mode
make dev

# View logs
make dev-logs

# Check status
make dev-status
```

**Running Migrations**

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Open Prisma Studio
pnpm prisma:studio
```

## 📖 API Documentation

Explore the Bruno API collection in `bruno-api-collection/` for complete API
documentation with examples.

## 🏗️ Related Repositories

Need help with the full stack?

- **[expense-manager-app](https://github.com/sakilahmmad71/expense-manager-app)** -
  React frontend application
- **[expense-manager-loadbalancer](https://github.com/sakilahmmad71/expense-manager-loadbalancer)** -
  Nginx load balancer
- **[expense-manager-landing](https://github.com/sakilahmmad71/expense-manager-landing)** -
  Marketing landing page

## 🤝 Contributing

Want to contribute? Check out:

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community guidelines
- [Good First Issues](https://github.com/sakilahmmad71/expense-manager-apis/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

## ⏱️ Response Times

- **Critical bugs**: Within 24-48 hours
- **Feature requests**: Within 1 week
- **Questions**: Within 2-3 days
- **Pull requests**: Within 1 week

## 📝 Feedback

Your feedback helps us improve! Feel free to:

- ⭐ Star the repository if you find it useful
- 📢 Share with others who might benefit
- 💡 Suggest improvements and new features

---

Thank you for using Expenser API! 🚀
