# Deploying Go + React to Railway with Docker

This guide covers deploying our Go backend + React frontend blog application to Railway using Docker with zero configuration required.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Railway Setup](#railway-setup)
3. [Configuration Files](#configuration-files)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

## Project Overview

Our project uses a multi-stage Docker build:

```
go-react/
├── backend/                 # Go backend
├── frontend/               # React frontend
├── Dockerfile             # Multi-stage Docker build
├── railway.json           # Railway configuration
└── init-data.sh          # Data initialization script
```

## Railway Setup

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway automatically detects the Dockerfile

## Configuration Files

### `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "volumes": [
    {
      "name": "blog-data",
      "mountPath": "/app/data"
    }
  ]
}
```

### `Dockerfile` (Multi-Stage Build)

```dockerfile
# Frontend build stage
FROM node:22-alpine3.20 AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Backend build stage
FROM golang:1.22-alpine3.20 AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go build -o backend main.go

# Final stage
FROM alpine:3.20
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=backend-builder /app/backend .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY backend/data ./seed-data
COPY backend/templates ./templates
COPY init-data.sh ./
RUN chmod +x init-data.sh
RUN mkdir -p /app/data
EXPOSE 8080
ENV PORT=8080
ENV BLOG_DATA_DIR=/app/data
CMD ["./init-data.sh"]
```

### `init-data.sh`

```bash
#!/bin/sh
if [ ! "$(ls -A /app/data 2>/dev/null)" ]; then
    echo "Initializing data from seed..."
    cp -r /app/seed-data/* /app/data/
fi
exec ./backend
```

## Deployment

1. Go to Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway automatically detects Dockerfile and deploys

**What happens:**

- Multi-stage Docker build (frontend → backend → final image)
- Volume mounted at `/app/data` for persistence
- Init script copies seed data on first run
- Application starts on Railway's assigned port

## Troubleshooting

**Build fails**: Test locally with `docker build -t go-react-app .`

**App won't start**: Check Railway logs for init script errors

**Data not persisting**: Verify volume configuration in `railway.json`

**Health check fails**: Ensure `/api/health` endpoint is accessible

## Best Practices

- **Test locally**: `docker build -t go-react-app . && docker run -p 8080:8080 go-react-app`
- **Monitor logs**: Use Railway dashboard to check deployment logs
- **Data backup**: Export blog data regularly for backup
- **Security**: Keep base images updated

## Conclusion

Your Go + React blog application is ready for deployment on Railway with Docker! The multi-stage build handles everything automatically with zero configuration required.

**Key benefits:**

- Consistent deployments across environments
- Automatic data persistence with Railway volumes
- Minimal attack surface with Alpine Linux
- Optimized multi-stage builds

Happy deploying! 🚀
