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
	// Check if we're in production (Railway sets PORT)
	if os.Getenv("PORT") != "" {
		// Production: serve React Router build files
		// Serve static assets from both dist/assets and dist/client/assets
		router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir("dist/assets/"))))
		router.PathPrefix("/client/assets/").Handler(http.StripPrefix("/client/assets/", http.FileServer(http.Dir("dist/client/assets/"))))
		router.PathPrefix("/robots.txt").Handler(http.FileServer(http.Dir("dist/client/")))
		
		// For all other routes, serve the React app from dist directory
		// This should catch /client/ and serve the React app
		spa := spaHandler{staticPath: "dist", indexPath: "index.html"}
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
	// Try to serve the file
	path := h.staticPath + r.URL.Path
	fileInfo, err := os.Stat(path)
	if os.IsNotExist(err) {
		// File doesn't exist, serve index.html (SPA routing)
		http.ServeFile(w, r, h.staticPath+"/"+h.indexPath)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	// If it's a directory, serve index.html (SPA routing)
	if fileInfo.IsDir() {
		http.ServeFile(w, r, h.staticPath+"/"+h.indexPath)
		return
	}
	
	// File exists, serve it
	http.ServeFile(w, r, path)
}
