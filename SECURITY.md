# Security Policy

## Supported Versions

We actively support the latest version of NZXT-ESC. Security updates are provided for:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 🛡️ How to Report

1. **Do NOT** open a public issue on GitHub
2. Email your report to: **mrgogo7@gmail.com**
   - Subject: `[SECURITY] NZXT-ESC Vulnerability Report`
   - Include a detailed description of the vulnerability
   - Provide steps to reproduce the issue
   - Include potential impact assessment

### 📋 What to Include

Please provide as much information as possible:

- **Type of vulnerability** (XSS, CSRF, injection, authentication bypass, etc.)
- **Affected components** (frontend, backend, configuration, storage, etc.)
- **Steps to reproduce** the vulnerability
- **Potential impact** and severity assessment
- **Suggested fix** (if any)

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Resolution**: Depends on severity, but we aim for quick fixes

### 🔐 Security Best Practices for Contributors

When contributing to NZXT-ESC, please keep in mind:

- **Never commit secrets** (API keys, passwords, tokens)
- **Validate all user input** before processing
- **Use secure storage methods** (avoid storing sensitive data in localStorage without encryption)
- **Follow OWASP guidelines** for web application security
- **Test for XSS vulnerabilities** in user-provided URLs
- **Sanitize media URLs** before rendering

### 🚨 Severity Levels

We classify vulnerabilities using the following severity levels:

- **Critical**: Remote code execution, authentication bypass, data breach
- **High**: Privilege escalation, sensitive data exposure
- **Medium**: Information disclosure, CSRF vulnerabilities
- **Low**: Minor information leaks, best practice violations

### ✅ Recognition

We believe in recognizing security researchers who help us improve NZXT-ESC. With your permission, we will:

- Credit you in our security advisories (if you wish)
- Mention your contribution in release notes (if applicable)

### 📝 Notes

- This security policy applies to the NZXT-ESC project and its dependencies
- We follow responsible disclosure practices
- All security reports are handled confidentially

Thank you for helping keep NZXT-ESC secure! 🔒

