# Deploying Go + React to Railway: Complete Deployment Guide

Railway is a modern deployment platform that makes it incredibly easy to deploy full-stack applications. In this comprehensive guide, we'll walk through deploying our Go backend + React frontend blog application to Railway with zero configuration required.

## Table of Contents

1. [Why Railway?](#why-railway)
2. [Project Overview](#project-overview)
3. [Railway Account Setup](#railway-account-setup)
4. [Preparing Your Project](#preparing-your-project)
5. [Railway Configuration Files](#railway-configuration-files)
6. [Deployment Process](#deployment-process)
7. [Environment Variables](#environment-variables)
8. [Custom Domain Setup](#custom-domain-setup)
9. [Monitoring and Logs](#monitoring-and-logs)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)
11. [Production Optimizations](#production-optimizations)
12. [CI/CD with GitHub](#cicd-with-github)
13. [Cost Management](#cost-management)
14. [Best Practices](#best-practices)

## Why Railway?

Railway offers several advantages for deploying Go + React applications:

- **Zero Configuration**: Deploy without complex Docker files or build scripts
- **Automatic Detection**: Automatically detects Go and Node.js projects
- **Built-in Database**: Easy PostgreSQL integration
- **Custom Domains**: Free custom domain support
- **Environment Variables**: Secure environment management
- **GitHub Integration**: Automatic deployments from Git
- **Generous Free Tier**: Perfect for personal projects and MVPs
- **Real-time Logs**: Built-in monitoring and debugging

## Project Overview

Our project structure:

```
go-react/
├── backend/                 # Go backend
│   ├── main.go
│   ├── go.mod
│   ├── go.sum
│   ├── models/
│   ├── handlers/
│   ├── storage/
│   ├── routes/
│   ├── middleware/
│   ├── tools/
│   └── data/               # Blog content
├── frontend/               # React frontend
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── dist/              # Built React app
├── railway.json           # Railway configuration
├── railway-build.sh       # Build script
└── README.md
```

## Railway Account Setup

### 1. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub (recommended for easy Git integration)

### 2. Install Railway CLI (Optional but Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

## Preparing Your Project

### 1. Ensure Your Project is Git-Enabled

```bash
# Initialize Git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit for Railway deployment"
```

### 2. Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

## Railway Configuration Files

Railway can auto-detect your project, but explicit configuration ensures optimal deployment.

### 1. `railway.json` (Root Level)

Create this file in your project root:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && go run .",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. `railway-build.sh` (Build Script)

Create this script in your project root:

```bash
#!/bin/bash

echo "🚀 Starting Railway build process..."

# Build React frontend
echo "📦 Building React frontend..."
cd frontend
npm ci
npm run build
cd ..

# Build Go backend
echo "🔨 Building Go backend..."
cd backend
go mod download
go build -o main .
cd ..

echo "✅ Build completed successfully!"
```

Make it executable:

```bash
chmod +x railway-build.sh
```

### 3. Backend Configuration Updates

Update your `backend/main.go` to handle Railway's environment:

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "go-react-backend/handlers"
    "go-react-backend/middleware"
    "go-react-backend/routes"
    "go-react-backend/storage"
)

func main() {
    // Initialize blog storage with data directory
    dataDir := os.Getenv("BLOG_DATA_DIR")
    if dataDir == "" {
        // Railway provides persistent storage in /data
        dataDir = "/data"
    }

    blogStore, err := storage.NewFileBlogStore(dataDir)
    if err != nil {
        log.Fatalf("Failed to initialize blog storage: %v", err)
    }

    // Initialize handlers
    blogHandler := handlers.NewBlogHandler(blogStore)

    // Setup routes
    router := routes.SetupRoutes(blogHandler)

    // Apply middleware
    handler := middleware.SetupCORS()(router)
    handler = middleware.LoggingMiddleware(handler)

    // Serve static files from React build (for production)
    if os.Getenv("RAILWAY_ENVIRONMENT") == "production" {
        // Production: serve React build files
        spa := spaHandler{staticPath: "../frontend/dist", indexPath: "index.html"}
        router.PathPrefix("/").Handler(spa)
    }

    // Get port from Railway (Railway sets PORT environment variable)
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // Default for local development
    }

    // Start server
    fmt.Printf("🚀 Go server starting on port %s\n", port)
    fmt.Printf("📡 API available at http://localhost:%s/api\n", port)
    fmt.Printf("🏥 Health check at http://localhost:%s/api/health\n", port)
    fmt.Printf("📝 Blog data stored in: %s\n", dataDir)

    log.Fatal(http.ListenAndServe(":"+port, handler))
}

// spaHandler handles serving the React SPA
type spaHandler struct {
    staticPath string
    indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // Try to serve the file
    path := h.staticPath + r.URL.Path
    _, err := os.Stat(path)
    if os.IsNotExist(err) {
        // File doesn't exist, serve index.html (SPA routing)
        http.ServeFile(w, r, h.staticPath+"/"+h.indexPath)
        return
    } else if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    // File exists, serve it
    http.ServeFile(w, r, path)
}
```

### 4. Frontend Configuration

Update your `frontend/package.json` build script:

```json
{
  "name": "go-react-frontend",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-markdown": "^8.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "vite": "^4.0.0",
    "typescript": "^4.9.0"
  }
}
```

## Deployment Process

### Method 1: GitHub Integration (Recommended)

1. **Connect GitHub Repository**

   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Build Settings**
   - Railway will auto-detect your Go project
   - Set the root directory to your project root
   - Railway will automatically:
     - Detect Go backend
     - Build React frontend
     - Deploy both

### Method 2: Railway CLI

```bash
# Navigate to your project directory
cd /path/to/your/go-react-project

# Initialize Railway project
railway init

# Deploy
railway up
```

### Method 3: Manual Upload

1. **Create New Project**

   - Go to Railway dashboard
   - Click "New Project"
   - Select "Empty Project"

2. **Upload Code**
   - Use Railway CLI or drag-and-drop
   - Railway will automatically detect and build

## Environment Variables

Railway provides a secure way to manage environment variables:

### 1. Setting Environment Variables

In Railway dashboard:

1. Go to your project
2. Click on "Variables" tab
3. Add the following variables:

```bash
# Required
PORT=8080
RAILWAY_ENVIRONMENT=production

# Optional
BLOG_DATA_DIR=/data
NODE_ENV=production
```

### 2. Environment-Specific Configuration

Create different configurations for different environments:

**Development:**

```bash
BLOG_DATA_DIR=./data
NODE_ENV=development
```

**Production:**

```bash
BLOG_DATA_DIR=/data
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
```

### 3. Accessing Environment Variables in Go

```go
// In your Go code
port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}

dataDir := os.Getenv("BLOG_DATA_DIR")
if dataDir == "" {
    dataDir = "/data" // Railway persistent storage
}
```

## Custom Domain Setup

### 1. Add Custom Domain

1. Go to your Railway project
2. Click "Settings" → "Domains"
3. Click "Custom Domain"
4. Enter your domain name
5. Follow DNS configuration instructions

### 2. DNS Configuration

Add these DNS records to your domain provider:

```
Type: CNAME
Name: www
Value: your-app.railway.app

Type: A
Name: @
Value: [Railway IP address]
```

### 3. SSL Certificate

Railway automatically provides SSL certificates for custom domains.

## Monitoring and Logs

### 1. Viewing Logs

```bash
# Using Railway CLI
railway logs

# Or view in Railway dashboard
# Go to your project → "Deployments" → Click on deployment
```

### 2. Real-time Monitoring

Railway provides:

- **Deployment logs**: Build and runtime logs
- **Metrics**: CPU, memory, and network usage
- **Health checks**: Automatic health monitoring
- **Alerts**: Email notifications for failures

### 3. Health Check Configuration

Your Go backend already includes a health check endpoint:

```go
// In routes/routes.go
api.HandleFunc("/health", healthHandler).Methods("GET")

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)

    response := map[string]interface{}{
        "message":   "Go backend is healthy! 🟢",
        "timestamp": time.Now().Format(time.RFC3339),
        "status":    "ok",
        "features":  []string{"blogs", "file-storage"},
    }

    json.NewEncoder(w).Encode(response)
}
```

## Troubleshooting Common Issues

### 1. Build Failures

**Problem**: Go build fails
**Solution**: Check `go.mod` and ensure all dependencies are properly specified

```bash
# In your backend directory
go mod tidy
go mod download
```

**Problem**: React build fails
**Solution**: Check Node.js version and dependencies

```bash
# In your frontend directory
npm ci
npm run build
```

### 2. Runtime Errors

**Problem**: Port binding issues
**Solution**: Ensure you're using Railway's PORT environment variable

```go
port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}
```

**Problem**: File system permissions
**Solution**: Use Railway's persistent storage directory

```go
dataDir := "/data" // Railway persistent storage
```

### 3. Static File Serving Issues

**Problem**: React app not loading
**Solution**: Ensure proper static file serving configuration

```go
// Serve static files from React build
if os.Getenv("RAILWAY_ENVIRONMENT") == "production" {
    spa := spaHandler{staticPath: "../frontend/dist", indexPath: "index.html"}
    router.PathPrefix("/").Handler(spa)
}
```

### 4. CORS Issues

**Problem**: Frontend can't access backend API
**Solution**: Configure CORS properly

```go
// In middleware/cors.go
func SetupCORS() func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Allow your Railway domain
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

            if r.Method == "OPTIONS" {
                w.WriteHeader(http.StatusOK)
                return
            }

            next.ServeHTTP(w, r)
        })
    }
}
```

## Production Optimizations

### 1. Go Optimizations

```go
// Build with optimizations
go build -ldflags="-s -w" -o main .

// Or in your build script
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o main .
```

### 2. React Optimizations

```json
// In frontend/package.json
{
  "scripts": {
    "build": "vite build --mode production"
  }
}
```

### 3. Railway Build Optimizations

```bash
#!/bin/bash
# railway-build.sh

echo "🚀 Starting optimized Railway build..."

# Build React with optimizations
cd frontend
npm ci --only=production
npm run build
cd ..

# Build Go with optimizations
cd backend
go mod download
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o main .
cd ..

echo "✅ Optimized build completed!"
```

### 4. Environment-Specific Builds

```go
// In main.go
func main() {
    // Production optimizations
    if os.Getenv("RAILWAY_ENVIRONMENT") == "production" {
        // Disable debug logging
        log.SetFlags(log.LstdFlags)

        // Optimize for production
        runtime.GOMAXPROCS(runtime.NumCPU())
    }

    // ... rest of your code
}
```

## CI/CD with GitHub

### 1. Automatic Deployments

Railway automatically deploys when you push to your main branch:

1. Push code to GitHub
2. Railway detects changes
3. Automatically builds and deploys
4. Sends deployment notifications

### 2. Branch-based Deployments

Set up different environments for different branches:

- `main` → Production
- `develop` → Staging
- `feature/*` → Preview deployments

### 3. GitHub Actions Integration

Create `.github/workflows/railway.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Go
        uses: actions/setup-go@v3
        with:
          go-version: "1.21"

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Build and Test
        run: |
          cd backend
          go mod download
          go test ./...

          cd ../frontend
          npm ci
          npm run build

      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## Cost Management

### 1. Railway Pricing

- **Free Tier**: $5 credit monthly
- **Pro Plan**: $20/month for unlimited usage
- **Team Plan**: $99/month for team features

### 2. Optimizing Costs

```go
// Optimize resource usage
func main() {
    // Set memory limits
    debug.SetMemoryLimit(100 * 1024 * 1024) // 100MB

    // Optimize garbage collection
    runtime.GC()

    // ... rest of your code
}
```

### 3. Monitoring Usage

- Check Railway dashboard for usage metrics
- Set up billing alerts
- Monitor resource consumption

## Best Practices

### 1. Security

```go
// Secure environment variables
func getSecret(key string) string {
    value := os.Getenv(key)
    if value == "" {
        log.Fatalf("Required environment variable %s not set", key)
    }
    return value
}

// Use HTTPS in production
func main() {
    if os.Getenv("RAILWAY_ENVIRONMENT") == "production" {
        // Force HTTPS
        http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
            if r.Header.Get("X-Forwarded-Proto") != "https" {
                http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
                return
            }
        })
    }
}
```

### 2. Error Handling

```go
// Comprehensive error handling
func handleError(w http.ResponseWriter, err error, statusCode int) {
    log.Printf("Error: %v", err)

    if os.Getenv("RAILWAY_ENVIRONMENT") == "production" {
        // Don't expose internal errors in production
        http.Error(w, "Internal Server Error", statusCode)
    } else {
        // Show detailed errors in development
        http.Error(w, err.Error(), statusCode)
    }
}
```

### 3. Logging

```go
// Structured logging
import "log/slog"

func main() {
    // Configure logging based on environment
    if os.Getenv("RAILWAY_ENVIRONMENT") == "production" {
        slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))
    } else {
        slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, nil)))
    }

    slog.Info("Starting server", "port", port, "environment", os.Getenv("RAILWAY_ENVIRONMENT"))
}
```

### 4. Database Considerations

For production applications, consider adding a database:

```go
// Add PostgreSQL support
import (
    "database/sql"
    _ "github.com/lib/pq"
)

type DatabaseBlogStore struct {
    db *sql.DB
}

func NewDatabaseBlogStore() (*DatabaseBlogStore, error) {
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        return nil, fmt.Errorf("DATABASE_URL not set")
    }

    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        return nil, err
    }

    return &DatabaseBlogStore{db: db}, nil
}
```

## Conclusion

Railway provides an excellent platform for deploying Go + React applications with minimal configuration. Key takeaways:

1. **Zero Configuration**: Railway auto-detects and builds your project
2. **GitHub Integration**: Automatic deployments from your repository
3. **Environment Management**: Secure environment variable handling
4. **Custom Domains**: Easy custom domain setup with SSL
5. **Monitoring**: Built-in logs and metrics
6. **Cost Effective**: Generous free tier for personal projects

### Next Steps

1. **Deploy your application** using the steps above
2. **Set up monitoring** and alerts
3. **Configure custom domain** for production
4. **Add database** for production use
5. **Implement CI/CD** with GitHub Actions
6. **Monitor costs** and optimize resource usage

Your Go + React blog application is now ready for production deployment on Railway! 🚀

### Useful Commands

```bash
# Railway CLI commands
railway login
railway init
railway up
railway logs
railway status
railway variables
railway domain

# Local development
cd backend && go run .
cd frontend && npm run dev

# Build for production
./railway-build.sh
```

Happy deploying! 🎉
