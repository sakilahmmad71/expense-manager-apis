# Security Policy

## Supported Versions

We actively support the following versions of the Expense Manager API with
security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the Expense Manager API seriously. If you have
discovered a security vulnerability, please follow these guidelines:

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing us at:
**sakilahmmad71@gmail.com**

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting,
  etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- **Initial Response**: We will acknowledge receipt of your vulnerability report
  within 48 hours.
- **Investigation**: We will investigate and validate the vulnerability within 7
  days.
- **Updates**: We will keep you informed of our progress throughout the process.
- **Resolution**: We will work to resolve confirmed vulnerabilities as quickly
  as possible.
- **Disclosure**: We will coordinate with you on the disclosure timeline.

### Security Best Practices

When deploying the Expense Manager API:

1. **Environment Variables**: Never commit sensitive environment variables to
   version control
2. **JWT Secrets**: Use strong, randomly generated JWT secrets (minimum 32
   characters)
3. **Database Security**: Use strong database passwords and restrict database
   access
4. **HTTPS**: Always use HTTPS in production environments
5. **Updates**: Keep dependencies up to date and monitor for security advisories
6. **CORS**: Configure CORS appropriately for your frontend domains
7. **Rate Limiting**: Implement rate limiting to prevent abuse
8. **Input Validation**: Validate all user inputs (already implemented via
   express-validator)

### Security Features

The Expense Manager API includes several security features:

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcryptjs
- **Input Validation**: All endpoints validate input using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **SQL Injection Prevention**: Prisma ORM provides protection against SQL
  injection
- **Structured Logging**: Security events are logged for monitoring

### Responsible Disclosure

We believe in responsible disclosure and will work with security researchers to:

- Acknowledge security reports promptly
- Provide regular updates during investigation
- Coordinate public disclosure timing
- Recognize researchers who report vulnerabilities responsibly

### Bug Bounty

Currently, we do not offer a formal bug bounty program. However, we greatly
appreciate security researchers who help us maintain the security of our
project.

## Security Contact

For security-related questions or concerns, please contact:

- **Email**: sakilahmmad71@gmail.com
- **Response Time**: Within 48 hours

Thank you for helping to keep the Expense Manager API and our users safe!
