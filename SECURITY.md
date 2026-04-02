# 🔒 Security Best Practices for Environment Variables

## Overview
This document outlines how environment variables and secrets are managed in the Creators Platform project. This setup follows industry best practices for keeping sensitive data safe.

---

## 🚨 Why This Matters

### The Danger of Hardcoding Secrets
```javascript
// ❌ NEVER DO THIS
const jwt = require('jsonwebtoken');
const secret = 'my_super_secret_123'; // 🚨 Exposed!
```

**What happens when secrets are exposed:**
- Attackers can impersonate users via forged JWTs
- Unauthorized file uploads via exposed API keys
- Full database access via connection strings
- Massive financial charges on cloud services (AWS, Cloudinary, etc.)
- Automated bots scan GitHub within minutes of a commit

**Real-world examples:**
- GitHub has built-in secret scanning — exposed keys are flagged automatically
- Thousands of developer projects have leaked credentials
- One exposed API key can cost thousands in unauthorized usage

---

## 📁 File Structure

```
creators-platform/
├── .env.example                 # Root template (no secrets)
├── .gitignore                   # Includes: .env, server/.env, client/.env
│
├── server/
│   ├── .env                     # ⚠️ NEVER COMMIT - dev secrets
│   ├── .env.example             # Template (placeholder values only)
│   ├── .env.docker              # Docker-specific overrides (localhost → mongo)
│   ├── .env.docker.example      # Template for .env.docker
│   └── .gitignore               # Includes: .env, .env.docker
│
├── client/
│   ├── .env                     # ⚠️ NEVER COMMIT - dev config
│   └── .env.example             # Template
│
└── docker-compose.yml           # Uses env_file method (best practice)
```

---

## 🔑 Three Methods for Environment Variables

### Method 1: Inline in Compose File (❌ Avoid for Secrets)
```yaml
server:
  environment:
    PORT: 5000                    # ✅ OK for non-sensitive
    JWT_SECRET: "secret123"       # ❌ NEVER for secrets!
```

**Pros:** Simple, visible
**Cons:** Commits to Git, exposed in logs, visible to everyone

---

### Method 2: env_file (✅ Our Choice)
```yaml
# docker-compose.yml
server:
  env_file:
    - ./server/.env              # Loads all vars from file
    - ./server/.env.docker       # Overrides specific vars
```

**How it works:**
1. Docker reads `./server/.env` (not committed to Git)
2. Docker reads `./server/.env.docker` (overrides .env)
3. All variables are injected into the container

**Pros:**
- Secrets never visible in compose file
- Easy to switch between local/Docker/production
- Different .env files for each developer

**Cons:**
- Requires discipline to keep .env files in .gitignore

---

### Method 3: Variable Substitution (⚠️ Use Cautiously)
```yaml
server:
  environment:
    JWT_SECRET: ${JWT_SECRET}    # Reads from host .env
```

**Pros:** Minimal compose file text
**Cons:** Requires host environment setup, easy to forget

---

## 📋 Our Setup Explained

### Root Level (.env.example)
```env
# Only Docker Compose configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
SERVER_PORT=5000
CLIENT_PORT=3000
NODE_ENV=development
```

**Why:** These aren't secrets — they don't change between users. The actual secrets (JWT, Cloudinary) go in server/.env.

---

### Server Level (server/.env)
```env
# ⚠️ NEVER COMMIT THIS FILE
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://admin:password123@localhost:27017/creators-platform?authSource=admin
JWT_SECRET=your-actual-secret-here          # 🔐 Real value
CLOUDINARY_CLOUD_NAME=your-cloud-name       # 🔐 Real value
CLOUDINARY_API_KEY=your-api-key            # 🔐 Real value
CLOUDINARY_API_SECRET=your-api-secret      # 🔐 Real value
```

**Why localhost?**
- When running locally: `npm run dev` connects to local MongoDB
- When running in Docker: uses server/.env.docker to override

---

### Docker Override (server/.env.docker)
```env
# Only used in Docker Compose
# Overrides MONGODB_URI to use Docker service name
MONGODB_URI=mongodb://admin:password123@mongo:27017/creators-platform?authSource=admin
```

**Why separate file?**
- Local: `localhost:27017` (local MongoDB)
- Docker: `mongo:27017` (service name)
- Same credentials, different hostname

---

### Docker Compose Configuration
```yaml
server:
  env_file:
    - ./server/.env        # Load variables
    - ./server/.env.docker # Override specific ones
  environment:
    PORT: 5000         # Override if needed
```

**Resolution Order (Highest to Lowest Priority):**
1. Inline `environment:` values (docker-compose.yml)
2. Shell environment variables (export VAR=value)
3. env_file values (loaded in order)
4. Dockerfile ENV defaults

---

## ✅ Step-by-Step Setup

### Step 1: Create server/.env
```bash
cd server
cp .env.example .env
# Edit .env with your REAL values
nano .env
```

**What to fill in:**
- `JWT_SECRET`: Generate a strong random string
- `CLOUDINARY_CLOUD_NAME`: From your Cloudinary dashboard
- `CLOUDINARY_API_KEY`: From your Cloudinary dashboard
- `CLOUDINARY_API_SECRET`: From your Cloudinary dashboard

### Step 2: Verify .gitignore
```bash
# Check that .env files are ignored
cat .gitignore
# Should include: .env, server/.env, client/.env
```

### Step 3: Test Local Development
```bash
cd server
npm run dev
# Should connect to MongoDB at localhost:27017
```

### Step 4: Test Docker
```bash
docker-compose up --build
# Should connect to MongoDB at mongo:27017
# (via .env.docker override)
```

### Step 5: Verify Variables in Container
```bash
docker-compose exec server env | grep JWT_SECRET
docker-compose exec server env | grep CLOUDINARY
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Committing .env to Git
```bash
# Check Git status
git status
# If .env appears here, it was committed!

# Fix (too late if pushed):
git rm --cached server/.env
git commit -m "Remove .env from tracking"
# ⚠️ But secrets remain in Git history forever!
```

**Prevention:** Add to .gitignore BEFORE first commit

---

### ❌ Mistake 2: Using localhost in Docker
```yaml
# ❌ WRONG
MONGODB_URI=mongodb://localhost:27017  # Won't work in container!

# ✅ CORRECT
MONGODB_URI=mongodb://mongo:27017      # Use service name
```

**Why:** Inside Docker, "localhost" = container itself, not your machine

---

### ❌ Mistake 3: Hardcoding in Code
```javascript
// ❌ NEVER
const secret = 'my_secret_123';

// ✅ ALWAYS
const secret = process.env.JWT_SECRET;
```

---

### ❌ Mistake 4: Including Secrets in .env.example
```env
# ❌ WRONG (.env.example)
JWT_SECRET=abc123defgh  # Real secret!

# ✅ CORRECT (.env.example)
JWT_SECRET=your-secret-here-change-this
```

**.env.example** should be committed to Git as documentation. It shows what variables are needed but with placeholder values.

---

## 🌐 Production Deployment

### DO NOT
```
❌ Commit .env files
❌ Copy .env files to production via SCP
❌ Hardcode secrets in docker-compose.yml
```

### DO Use Platform Secrets
**AWS:**
```
Secrets Manager → Create secret → Reference in ECS task
```

**Render/Railway/Heroku:**
```
Dashboard → Environment Variables → Add variable → Deploy
```

**Kubernetes:**
```
kubectl create secret generic app-secrets --from-literal=JWT_SECRET=xxx
```

**GitHub Actions (for CI/CD):**
```yaml
- name: Deploy
  env:
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## 📚 Reference

- [Docker Compose Environment Variables Documentation](https://docs.docker.com/compose/environment-variables/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [12 Factor App: Config](https://12factor.net/config)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 🎯 Checklist Before Each Commit

```
[ ] .env is NOT in git status
[ ] .gitignore includes .env
[ ] No secrets in any .example files
[ ] No secrets in docker-compose.yml
[ ] .env.example files are useful templates
[ ] No hardcoded secrets in source code
[ ] No credentials in comments
```

---

## Questions?

If environment variables aren't loading:

```bash
# 1. Check the file exists
ls server/.env

# 2. Docker logs
docker-compose logs server | grep -i env

# 3. Inside container
docker-compose exec server env

# 4. Check path is correct (relative to compose file)
cat docker-compose.yml | grep env_file
```

---

**Remember:** A security habit built now is a security practice for life. Treat every project like it's production, because you never know when it will be.