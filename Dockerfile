# Multi-stage build for Go + React application
FROM node:22-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install

# Copy frontend source
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Go build stage
FROM golang:1.21-alpine AS backend-builder

# Set working directory
WORKDIR /app

# Copy go mod files
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source
COPY backend/ ./

# Build backend
RUN go build -o backend main.go

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Set working directory
WORKDIR /app

# Copy backend binary from builder stage
COPY --from=backend-builder /app/backend .

# Copy frontend build from frontend stage
COPY --from=frontend-builder /app/frontend/dist ./dist

# Debug: List what's in the dist directory
RUN ls -la dist/
RUN ls -la dist/client/ || echo "No client directory"

# Copy backend data directory
COPY backend/data ./data

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV BLOG_DATA_DIR=/app/data

# Start the application
CMD ["./backend"]
