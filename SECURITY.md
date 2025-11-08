# 🔒 SECURITY BEST PRACTICES

This document outlines critical security practices for using the Neko Memory System.

## ⚠️ CRITICAL: Never Commit Sensitive Data

**NEVER commit these files to version control:**
- `.env` files (contains real credentials)
- `memories/` directory (may contain personal/sensitive information)
- Database exports with real data
- Investigation files
- Personal information
- API keys or credentials

## ✅ Safe Files to Commit

**These files are SAFE to commit:**
- `.env.example` (template with NO real values)
- Source code
- Documentation
- Tests (with mock/fake data only)
- Configuration templates

## 🛡️ Security Checklist

Before pushing to a public repository:

- [ ] Verify `.env` is in `.gitignore`
- [ ] Ensure `.env` file is NOT committed
- [ ] Use `.env.example` with placeholder values only
- [ ] No real MongoDB URIs in code
- [ ] No API keys in code
- [ ] No personal information in examples
- [ ] No investigation data in repository
- [ ] Memory directories are gitignored
- [ ] Run secret scanning tool (Gitleaks)

## 🔑 Environment Variables Setup

### 1. Copy the Template

```bash
cp .env.example .env
```

### 2. Edit with Your Real Values

```bash
# Edit .env (NEVER commit this file!)
nano .env
```

### 3. Verify .env is Gitignored

```bash
# This should show .env is ignored
git status
```

## 🔍 Secret Scanning

This repository uses **Gitleaks** for automatic secret scanning.

### Local Scanning

```bash
# Install Gitleaks
# Download from: https://github.com/gitleaks/gitleaks/releases

# Scan repository
gitleaks detect --source . --verbose
```

### Pre-Commit Hook

The repository includes automatic Gitleaks scanning before commits.

## 🗄️ MongoDB Security

### Never Expose Connection Strings

**BAD:**
```javascript
// ❌ NEVER DO THIS!
const uri = 'mongodb+srv://user:password@cluster.mongodb.net/db';
```

**GOOD:**
```javascript
// ✅ Always use environment variables
const uri = process.env.MONGODB_URI;
```

### Secure MongoDB Atlas Setup

1. **Use Network Access Lists**: Restrict IP addresses
2. **Enable Authentication**: Always require username/password
3. **Use TLS/SSL**: Encrypt data in transit
4. **Rotate Credentials**: Change passwords regularly
5. **Principle of Least Privilege**: Grant minimum required permissions

## 📁 Memory Storage Security

### File-Based Backend

If using file-based memory storage:

```bash
# Set restrictive permissions
chmod 700 ~/.claude/memories
```

### Encryption

For sensitive data, enable encryption:

```bash
# In .env
MEMORY_ENCRYPTION_ENABLED=true
MEMORY_ENCRYPTION_KEY=<generated-key>

# Generate key:
openssl rand -hex 32
```

## 🚨 If You Accidentally Commit Secrets

### 1. Remove the Secret from Code

```bash
# Edit the file to remove the secret
git add <file>
```

### 2. Rotate the Secret

**CRITICAL**: Change the exposed credential immediately!
- MongoDB: Rotate database password
- API Keys: Regenerate in provider dashboard
- Tokens: Revoke and create new ones

### 3. Remove from Git History

```bash
# Install BFG Repo Cleaner or use git filter-repo
# WARNING: This rewrites history!

# Using BFG
bfg --replace-text passwords.txt

# Or using git filter-repo
git filter-repo --path <file> --invert-paths
```

### 4. Force Push (Dangerous!)

```bash
# WARNING: Coordin
ate with team first!
git push --force
```

### 5. Notify Team

Alert all collaborators that they need to:
- Fetch the rewritten history
- Update their local repositories
- Verify they don't have copies of the secret

## 🔐 Best Practices Summary

1. **Environment Variables**: Always use `.env` files for secrets
2. **Never Hardcode**: No credentials in source code
3. **Gitignore First**: Set up `.gitignore` before first commit
4. **Secret Scanning**: Use Gitleaks or similar tools
5. **Regular Audits**: Periodically review for exposed secrets
6. **Encryption**: Encrypt sensitive memory files
7. **Access Control**: Restrict who can access production credentials
8. **Separation**: Keep personal/investigation data separate from code

## 📚 Additional Resources

- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

## 🆘 Security Issues

If you discover a security vulnerability, please:
1. **DO NOT** open a public issue
2. Email the maintainer directly
3. Provide detailed information
4. Wait for response before disclosure

---

**Remember: Security is everyone's responsibility!** 🔒
