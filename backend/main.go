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
	// For Railway deployment, use absolute path or environment variable
	dataDir := os.Getenv("BLOG_DATA_DIR")
	if dataDir == "" {
		// Local development: use relative path from project root
		dataDir = "data"
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
	// Check if we're running from dist directory or if dist directory exists
	var staticPath string
	var assetsPath string
	var clientAssetsPath string
	var robotsPath string
	
	// Debug: Check current working directory and file existence
	wd, _ := os.Getwd()
	fmt.Printf("🔍 Current working directory: %s\n", wd)
	
	// Check for index.html in current directory
	if _, err := os.Stat("index.html"); err == nil {
		// Running from dist directory
		staticPath = "."
		assetsPath = "./assets"
		clientAssetsPath = "./client/assets"
		robotsPath = "./client"
		fmt.Printf("🔍 Production mode: running from dist directory, serving static files from current directory\n")
	} else {
		fmt.Printf("🔍 index.html not found in current directory: %v\n", err)
	}
	
	// Check for dist directory (if running from parent directory)
	if staticPath == "" {
		if _, err := os.Stat("dist"); err == nil {
			// Running from parent directory, dist exists
			staticPath = "dist"
			assetsPath = "dist/assets"
			clientAssetsPath = "dist/client/assets"
			robotsPath = "dist/client"
			fmt.Printf("🔍 Production mode: dist directory found, serving static files from dist directory\n")
		} else {
			fmt.Printf("🔍 dist directory not found: %v\n", err)
			
			// Check if we're in backend directory and dist is in parent
			if _, err := os.Stat("../dist"); err == nil {
				staticPath = "../dist"
				assetsPath = "../dist/assets"
				clientAssetsPath = "../dist/client/assets"
				robotsPath = "../dist/client"
				fmt.Printf("🔍 Production mode: dist directory found in parent, serving static files from ../dist\n")
			} else {
				fmt.Printf("🔍 ../dist directory not found: %v\n", err)
			}
		}
	}
	
	if staticPath == "" {
		fmt.Printf("🔍 Development mode: no static files found, skipping static file serving\n")
	}
	
	if staticPath != "" {
		// Production: serve React Router build files
		// Serve static assets from both assets and client/assets
		router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir(assetsPath))))
		router.PathPrefix("/client/assets/").Handler(http.StripPrefix("/client/assets/", http.FileServer(http.Dir(clientAssetsPath))))
		router.PathPrefix("/robots.txt").Handler(http.FileServer(http.Dir(robotsPath)))
		
		// Create SPA handler
		spa := spaHandler{staticPath: staticPath, indexPath: "index.html"}
		
		// Handle root route explicitly
		router.Handle("/", spa)
		
		// Handle all other routes with catch-all
		router.PathPrefix("/").Handler(spa)
	}

	// Get port from environment (Railway sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default for local development
	}

	// Debug: Print all environment variables
	fmt.Printf("🔍 Environment PORT: %s\n", os.Getenv("PORT"))
	fmt.Printf("🔍 Using port: %s\n", port)

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
	// Debug logging
	fmt.Printf("🔍 SPA Handler - Request: %s, StaticPath: %s, IndexPath: %s\n", r.URL.Path, h.staticPath, h.indexPath)
	
	// Try to serve the file
	path := h.staticPath + r.URL.Path
	fmt.Printf("🔍 Looking for file at: %s\n", path)
	
	fileInfo, err := os.Stat(path)
	if os.IsNotExist(err) {
		// File doesn't exist, serve index.html (SPA routing)
		indexPath := h.staticPath + "/" + h.indexPath
		fmt.Printf("🔍 File not found, serving index.html from: %s\n", indexPath)
		
		// Check if index.html exists
		if _, err := os.Stat(indexPath); err != nil {
			fmt.Printf("🔍 ERROR: index.html not found at %s: %v\n", indexPath, err)
			http.Error(w, "index.html not found", http.StatusNotFound)
			return
		}
		
		http.ServeFile(w, r, indexPath)
		return
	} else if err != nil {
		fmt.Printf("🔍 Error checking file: %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	// If it's a directory, serve index.html (SPA routing)
	if fileInfo.IsDir() {
		indexPath := h.staticPath + "/" + h.indexPath
		fmt.Printf("🔍 Directory found, serving index.html from: %s\n", indexPath)
		
		// Check if index.html exists
		if _, err := os.Stat(indexPath); err != nil {
			fmt.Printf("🔍 ERROR: index.html not found at %s: %v\n", indexPath, err)
			http.Error(w, "index.html not found", http.StatusNotFound)
			return
		}
		
		http.ServeFile(w, r, indexPath)
		return
	}
	
	// File exists, serve it
	fmt.Printf("🔍 Serving file: %s\n", path)
	http.ServeFile(w, r, path)
}
