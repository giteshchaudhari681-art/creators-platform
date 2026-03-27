# 🚀 Quick Reference - Environment Variables

## TL;DR - The Most Important Points

### Never Do This ❌
```bash
# ❌ DON'T hardcode secrets
const secret = "my_secret_123";

# ❌ DON'T commit .env files
git add server/.env  # WRONG!

# ❌ DON'T use localhost in Docker
MONGODB_URI=mongodb://localhost:27017  # Won't work!
```

### Always Do This ✅
```bash
# ✅ DO use environment variables
const secret = process.env.JWT_SECRET;

# ✅ DO keep .env in .gitignore
# ✅ DO use service names in Docker
MONGODB_URI=mongodb://mongo:27017  # Correct for Docker
```

---

## File Quick Reference

| File | Committed? | Contains | Purpose |
|------|-----------|----------|---------|
| `.env.example` | ✅ YES | Placeholders | Template documentation |
| `.env` | ❌ NO | Real secrets | Local dev values |
| `server/.env.example` | ✅ YES | Placeholders | Server template |
| `server/.env` | ❌ NO | Real secrets | Server values |
| `server/.env.docker.example` | ✅ YES | Placeholders | Docker template |
| `server/.env.docker` | ❌ NO | Docker config | Docker overrides |
| `docker-compose.yml` | ✅ YES | env_file ref | Uses env_file method |

---

## Setup Checklist

```bash
# 1. Copy templates
cp server/.env.example server/.env
cp server/.env.docker.example server/.env.docker

# 2. Edit with real values
nano server/.env
# Set: JWT_SECRET, CLOUDINARY_*, etc.

# 3. Test locally
cd server && npm run dev

# 4. Test Docker
docker-compose up --build

# 5. Verify variables
docker-compose exec server env | grep JWT_SECRET
```

---

## Common Commands

```bash
# Check git status (should show NO .env files)
git status

# View env in running container
docker-compose exec server env

# See what variables a service is using
docker-compose config | grep -A 20 "^services:"

# Watch logs while starting
docker-compose logs -f server

# Check if ports are available
netstat -ano | findstr :5000
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Server won't start | Env var missing | Check: `docker-compose exec server env` |
| DB connection fails | Using localhost | Use `mongo` in Docker, `localhost` locally |
| Variables showing in logs | Using inline environment | Switch to env_file method |
| .env got committed | Not in .gitignore | Add to .gitignore and rebuild history |
| Port already in use | Another process running | Kill process: `taskkill /PID <PID> /F` |

---

## Environment Variables Map

### Root Level (.env)
- `MONGO_ROOT_USERNAME` - MongoDB root user (non-secret)
- `MONGO_ROOT_PASSWORD` - MongoDB root pass (technically a secret, but used only for setup)
- `SERVER_PORT` - Port server runs on (default: 5000)
- `CLIENT_PORT` - Port client runs on (default: 3000)
- `NODE_ENV` - development/production flag

### Server Level (server/.env)
- `PORT` - Server port (usually 5000)
- `NODE_ENV` - Environment flag
- `MONGODB_URI` - DB connection string
  - Local: `mongodb://admin:password123@localhost:27017/...`
  - Docker: `mongodb://admin:password123@mongo:27017/...` (in .env.docker)
- `JWT_SECRET` - 🔐 SECRET - Authentication key
- `JWT_EXPIRE` - Token expiration (e.g., 7d)
- `CLOUDINARY_CLOUD_NAME` - 🔐 SECRET - Cloudinary account
- `CLOUDINARY_API_KEY` - 🔐 SECRET - Cloudinary key
- `CLOUDINARY_API_SECRET` - 🔐 SECRET - Cloudinary secret

---

## Reading Error Messages

```
Error: MONGODB_URI is undefined
→ Solution: Check server/.env exists and has MONGODB_URI

listen EADDRINUSE :::5000
→ Solution: Port 5000 already in use, kill process or use different port

connection refused to mongo:27017
→ Solution: MongoDB not running or wrong hostname

Error: JWT_SECRET is not set
→ Solution: server/.env missing JWT_SECRET value
```

---

## One-Minute Security Check

```bash
# 1. NO .env files in git?
git status | grep ".env" # Should be empty

# 2. .env.example has placeholders?
cat server/.env.example | grep "your-"  # Should find placeholders

# 3. Real .env is git-ignored?
cat .gitignore | grep ".env"  # Should show .env lines

# 4. docker-compose uses env_file?
cat docker-compose.yml | grep "env_file"  # Should see env_file

# 5. Variables loading in Docker?
docker-compose exec server env | grep JWT_SECRET  # Should show value
```

All good? ✅ Your secrets are safe!

---

## Production Checklist

Before deploying to production:

- [ ] Rotate all secrets (JWT_SECRET, API keys)
- [ ] Use platform's secrets manager (not .env files)
- [ ] Never commit production .env files
- [ ] Different secrets for dev/staging/prod
- [ ] Audit all auth code for permission checks
- [ ] Enable HTTPS in nginx
- [ ] Review API endpoint security
- [ ] Set up monitoring/logging
- [ ] Document how to add new environment variables

---

## When Adding New Environment Variables

1. **Add to server/.env.example**
   ```env
   NEW_VAR=placeholder-value-here
   ```

2. **Add to server/config/env.js if it's environment-specific**
   ```js
   export const NEW_VAR = process.env.NEW_VAR || 'default';
   ```

3. **Use in code**
   ```js
   const value = process.env.NEW_VAR;
   ```

4. **Update docker-compose.yml if Docker-specific**
   ```yaml
   env_file:
     - ./server/.env
     - ./server/.env.docker  # Add here if Docker-only
   ```

5. **Commit the .example file, NOT the .env file**
   ```bash
   git add server/.env.example
   git add docker-compose.yml  # if changed
   # Do NOT commit server/.env
   ```

---

## Still Confused?

1. **Read SECURITY.md** - Complete explanations
2. **Read ENVIRONMENT_SETUP_GUIDE.md** - Step-by-step walkthrough
3. **Check ENVIRONMENT_IMPLEMENTATION_SUMMARY.md** - What was done
4. **Search Docker docs** - How Docker env works

Still stuck? Time to learn, Google is your friend!

---

**Remember: A security habit built now protects your entire career.** 🔒