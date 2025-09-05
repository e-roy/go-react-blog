#!/bin/bash

echo "🚀 Starting Railway build process..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🔨 Building React frontend..."
npm run build

# Go back to root
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
go mod tidy

# Build backend
echo "🔨 Building Go backend..."
go build -o ../dist/backend main.go

# Go back to root
cd ..

# Copy frontend build to dist folder
echo "📁 Copying frontend build files..."
mkdir -p dist
cp -r frontend/dist/* dist/

# Make backend executable
chmod +x dist/backend

echo "✅ Build complete! Files in dist/ folder:"
ls -la dist/

echo "🚂 Ready for Railway deployment!"
