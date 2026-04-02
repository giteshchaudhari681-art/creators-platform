# 🚀 Docker Hub Quick Reference Card

## Your Docker Hub Account
```
Username: giteshchaudhari2025
Profile: https://hub.docker.com/u/giteshchaudhari2025
```

## Your Images
```
Client:  giteshchaudhari2025/creator-platform-client:latest
         giteshchaudhari2025/creator-platform-client:v1.0.0

Server:  giteshchaudhari2025/creator-platform-server:latest
         giteshchaudhari2025/creator-platform-server:v1.0.0
```

---

## Quick Commands

### Verify Authentication
```bash
docker login
# Enter username and password
```

### Tag Images
```bash
# Client
docker tag creator-platform-client:latest \
    giteshchaudhari2025/creator-platform-client:latest

# Server
docker tag creator-platform-server:latest \
    giteshchaudhari2025/creator-platform-server:latest
```

### Push Images
```bash
# Push both to latest
docker push giteshchaudhari2025/creator-platform-client:latest
docker push giteshchaudhari2025/creator-platform-server:latest

# Push versioned tags
docker push giteshchaudhari2025/creator-platform-client:v1.0.0
docker push giteshchaudhari2025/creator-platform-server:v1.0.0
```

### Pull Images
```bash
docker pull giteshchaudhari2025/creator-platform-client:latest
docker pull giteshchaudhari2025/creator-platform-server:latest
```

### List Local Images
```bash
docker images | grep giteshchaudhari2025
```

### Run Production Compose
```bash
docker-compose -f docker-compose.prod.yml up
```

---

## Add Version Tags

### Create v1.1.0 Tags
```bash
# Tag
docker tag giteshchaudhari2025/creator-platform-client:latest \
    giteshchaudhari2025/creator-platform-client:v1.1.0
docker tag giteshchaudhari2025/creator-platform-server:latest \
    giteshchaudhari2025/creator-platform-server:v1.1.0

# Push
docker push giteshchaudhari2025/creator-platform-client:v1.1.0
docker push giteshchaudhari2025/creator-platform-server:v1.1.0
```

### Use Specific Version in Compose
```yaml
# docker-compose.prod.yml
client:
  image: giteshchaudhari2025/creator-platform-client:v1.1.0
server:
  image: giteshchaudhari2025/creator-platform-server:v1.1.0
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "unauthorized" | Run `docker login` again |
| Image not found | Verify image name includes username |
| "connection refused" | Check Docker is running |
| Push takes forever | Normal - large files upload slowly |
| Image older version | Add specific tag (v1.0.0) |

---

## Files You Have

```
docker-compose.yml          # Development: build from Dockerfile
docker-compose.prod.yml     # Production: pull from Docker Hub
DOCKER_HUB_GUIDE.md        # Full deployment guide
```

---

## Useful Links

| Resource | URL |
|----------|-----|
| Docker Hub Profile | https://hub.docker.com/u/giteshchaudhari2025 |
| Client Image | https://hub.docker.com/r/giteshchaudhari2025/creator-platform-client |
| Server Image | https://hub.docker.com/r/giteshchaudhari2025/creator-platform-server |
| Docker Docs | https://docs.docker.com |
| Docker Compose Docs | https://docs.docker.com/compose |

---

## Remember

✅ **For Development**: Use `docker-compose up --build` (automatic rebuild)  
✅ **For Production**: Use `docker-compose.prod.yml` (pulls pre-built)  
✅ **For Reliability**: Use semantic version tags (v1.0.0, not latest)  
✅ **For Deployment**: Pull from Docker Hub (fast, consistent)  

---

Keep this card handy! 📌