# Multi-stage build for Go + React application
FROM node:22-alpine3.20 AS frontend-builder

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd frontend && npm install

# Copy frontend source
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Go build stage
FROM golang:1.22-alpine3.20 AS backend-builder

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
FROM alpine:3.20

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Set working directory
WORKDIR /app

# Copy backend binary from builder stage
COPY --from=backend-builder /app/backend .

# Copy frontend build from frontend stage (direct path)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy backend data directory
COPY backend/data ./data

# Copy HTML templates
COPY backend/templates ./templates

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV BLOG_DATA_DIR=/app/data

# Start the application
CMD ["./backend"]
