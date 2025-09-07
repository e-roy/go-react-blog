package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go-react-backend/handlers"
	"go-react-backend/middleware"
	"go-react-backend/models"
	"go-react-backend/routes"
	"go-react-backend/storage"

	"github.com/gorilla/mux"
)

// AssetInfo holds the current asset filenames
type AssetInfo struct {
	JSFile  string
	CSSFile string
}

// findAssetFiles finds the current JS and CSS files in the dist/assets directory
func findAssetFiles(staticPath string) (*AssetInfo, error) {
	assetsDir := filepath.Join(staticPath, "assets")
	
	// Find JS file
	jsFiles, err := filepath.Glob(filepath.Join(assetsDir, "index-*.js"))
	if err != nil || len(jsFiles) == 0 {
		return nil, fmt.Errorf("no JS files found in assets directory")
	}
	
	// Find CSS file
	cssFiles, err := filepath.Glob(filepath.Join(assetsDir, "index-*.css"))
	if err != nil || len(cssFiles) == 0 {
		return nil, fmt.Errorf("no CSS files found in assets directory")
	}
	
	// Get just the filename (not full path)
	jsFile := filepath.Base(jsFiles[0])
	cssFile := filepath.Base(cssFiles[0])
	
	return &AssetInfo{
		JSFile:  jsFile,
		CSSFile: cssFile,
	}, nil
}

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
	
	// Load HTML templates
	templates := template.Must(template.ParseGlob("templates/*.html"))
	
	// Setup routes
	router := routes.SetupRoutes(blogHandler)
	
	// Apply middleware
	handler := middleware.SetupCORS()(router)
	handler = middleware.LoggingMiddleware(handler)
	
	// Serve static files from React build (for production)
	// Check if we're running from dist directory or if dist directory exists
	var staticPath string
	
	// Debug: Check current working directory and file existence
	wd, _ := os.Getwd()
	fmt.Printf("🔍 Current working directory: %s\n", wd)
	
	// Check for index.html in current directory
	if _, err := os.Stat("index.html"); err == nil {
		// Running from dist directory
		staticPath = "."
		fmt.Printf("🔍 Production mode: running from dist directory, serving static files from current directory\n")
	} else {
		fmt.Printf("🔍 index.html not found in current directory: %v\n", err)
	}
	
	// Check for dist directory (if running from parent directory)
	if staticPath == "" {
		// Look for frontend build directory in multiple locations
		possiblePaths := []string{
			"../frontend/dist",  // When running from backend/
			"frontend/dist",     // When running from root
			"dist",              // Legacy: copied dist
			"../dist",           // Legacy: copied dist in parent
		}
		
		for _, path := range possiblePaths {
			if _, err := os.Stat(path); err == nil {
				staticPath = path
				fmt.Printf("🔍 Production mode: found frontend build at %s\n", path)
				break
			}
		}
		
		if staticPath == "" {
			fmt.Printf("🔍 No frontend build directory found. Tried: %v\n", possiblePaths)
		}
	}
	
	if staticPath == "" {
		fmt.Printf("🔍 Development mode: no static files found, skipping static file serving\n")
	} else {
		// Production: serve React SPA
		// Serve static assets
		router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir(staticPath+"/assets"))))
		
		// Serve robots.txt if it exists
		if _, err := os.Stat(staticPath + "/robots.txt"); err == nil {
			router.PathPrefix("/robots.txt").Handler(http.FileServer(http.Dir(staticPath)))
		}
		
		// Find current asset files
		assetInfo, err := findAssetFiles(staticPath)
		if err != nil {
			log.Fatalf("Failed to find asset files: %v", err)
		}
		
		log.Printf("📦 Using assets: JS=%s, CSS=%s", assetInfo.JSFile, assetInfo.CSSFile)
		
		// Add sitemap route (must be before SPA handler)
		router.HandleFunc("/sitemap.xml", func(w http.ResponseWriter, r *http.Request) {
			if r.Method != "GET" {
				return
			}
			
			// Set XML content type
			w.Header().Set("Content-Type", "application/xml")
			
			// Fetch all blogs for sitemap generation
			blogs, err := blogStore.GetAllBlogs()
			if err != nil {
				http.Error(w, "Failed to fetch blogs for sitemap", http.StatusInternalServerError)
				return
			}
			
			// Generate sitemap XML
			sitemap := generateSitemapXML(blogs, r.Host)
			w.Write([]byte(sitemap))
		})
		
		// Add server-side rendered routes
		setupSSRRoutes(router, blogStore, templates, assetInfo)
		
		// Create SPA handler for remaining routes
		spa := spaHandler{staticPath: staticPath, indexPath: "index.html"}
		
		// Handle remaining routes with catch-all (for React Router)
		// Exclude API routes and sitemap from SPA handling
		router.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Skip SPA handling for API routes and sitemap
			if strings.HasPrefix(r.URL.Path, "/api/") || r.URL.Path == "/sitemap.xml" {
				http.NotFound(w, r)
				return
			}
			spa.ServeHTTP(w, r)
		}))
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
	// Skip API routes - they should be handled by the API router
	if strings.HasPrefix(r.URL.Path, "/api/") {
		http.NotFound(w, r)
		return
	}
	
	// Try to serve the file
	path := filepath.Join(h.staticPath, r.URL.Path)
	
	// Check if file exists and is not a directory
	if info, err := os.Stat(path); err == nil && !info.IsDir() {
		// File exists, serve it
		http.ServeFile(w, r, path)
		return
	}
	
	// File doesn't exist or is a directory, serve index.html (SPA routing)
	indexPath := filepath.Join(h.staticPath, h.indexPath)
	if _, err := os.Stat(indexPath); err != nil {
		http.Error(w, "index.html not found", http.StatusNotFound)
		return
	}
	
	// Set content type for HTML
	w.Header().Set("Content-Type", "text/html")
	http.ServeFile(w, r, indexPath)
}

// setupSSRRoutes configures server-side rendered routes
func setupSSRRoutes(router *mux.Router, blogStore models.BlogStore, templates *template.Template, assetInfo *AssetInfo) {
	// Home page with all blogs
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Only handle GET requests for the root path
		if r.Method != "GET" || r.URL.Path != "/" {
			return
		}
		
		blogs, err := blogStore.GetAllBlogs()
		if err != nil {
			http.Error(w, "Failed to fetch blogs", http.StatusInternalServerError)
			return
		}
		
		// Convert blogs to JSON for embedding
		blogData, err := json.Marshal(blogs)
		if err != nil {
			http.Error(w, "Failed to serialize blog data", http.StatusInternalServerError)
			return
		}
		
		// Determine base URL for canonical links
		baseURL := "https://" + r.Host
		if strings.Contains(r.Host, "localhost") {
			baseURL = "http://" + r.Host
		}
		
		// Render template with embedded data
		err = templates.ExecuteTemplate(w, "index.html", map[string]interface{}{
			"Title":       "Go + React Blog Platform",
			"Description": "A modern blog platform built with Go and React",
			"BaseURL":     baseURL,
			"BlogData":    template.JS(blogData),
			"JSFile":      assetInfo.JSFile,
			"CSSFile":     assetInfo.CSSFile,
		})
		if err != nil {
			http.Error(w, "Failed to render template", http.StatusInternalServerError)
			return
		}
	})
	
	// New blog page
	router.HandleFunc("/blogs/new", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			return
		}
		
		err := templates.ExecuteTemplate(w, "new.html", map[string]interface{}{
			"JSFile":  assetInfo.JSFile,
			"CSSFile": assetInfo.CSSFile,
		})
		if err != nil {
			http.Error(w, "Failed to render template", http.StatusInternalServerError)
			return
		}
	})
	
	
	// Individual blog post pages
	router.HandleFunc("/blogs/{slug}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		slug := vars["slug"]
		
		blog, err := blogStore.GetBlogBySlug(slug)
		if err != nil {
			// Render 404 page
			err = templates.ExecuteTemplate(w, "notfound.html", map[string]interface{}{
				"JSFile":  assetInfo.JSFile,
				"CSSFile": assetInfo.CSSFile,
			})
			if err != nil {
				http.NotFound(w, r)
			}
			return
		}
		
		// Convert blog to JSON for embedding
		blogData, err := json.Marshal(blog)
		if err != nil {
			http.Error(w, "Failed to serialize blog data", http.StatusInternalServerError)
			return
		}
		
		// Get base URL
		baseURL := "http://localhost:8080"
		if r.Host != "" {
			if r.TLS != nil {
				baseURL = "https://" + r.Host
			} else {
				baseURL = "http://" + r.Host
			}
		}
		
		// Render template with embedded data
		err = templates.ExecuteTemplate(w, "blog.html", map[string]interface{}{
			"Blog":     blog,
			"BaseURL":  baseURL,
			"BlogData": template.JS(blogData),
			"JSFile":   assetInfo.JSFile,
			"CSSFile":  assetInfo.CSSFile,
		})
		if err != nil {
			http.Error(w, "Failed to render template", http.StatusInternalServerError)
			return
		}
	})
	
	// Edit blog page
	router.HandleFunc("/blogs/{slug}/edit", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		slug := vars["slug"]
		
		blog, err := blogStore.GetBlogBySlug(slug)
		if err != nil {
			// Render 404 page
			err = templates.ExecuteTemplate(w, "notfound.html", map[string]interface{}{
				"JSFile":  assetInfo.JSFile,
				"CSSFile": assetInfo.CSSFile,
			})
			if err != nil {
				http.NotFound(w, r)
			}
			return
		}
		
		// Convert blog to JSON for embedding
		blogData, err := json.Marshal(blog)
		if err != nil {
			http.Error(w, "Failed to serialize blog data", http.StatusInternalServerError)
			return
		}
		
		// Render template with embedded data
		err = templates.ExecuteTemplate(w, "edit.html", map[string]interface{}{
			"Blog":     blog,
			"BlogData": template.JS(blogData),
			"JSFile":   assetInfo.JSFile,
			"CSSFile":  assetInfo.CSSFile,
		})
		if err != nil {
			http.Error(w, "Failed to render template", http.StatusInternalServerError)
			return
		}
	})
}

// generateSitemapXML generates a sitemap XML from blog data
func generateSitemapXML(blogs []models.Blog, host string) string {
	currentDate := time.Now().Format("2006-01-02")
	baseURL := "http://" + host
	if strings.Contains(host, "localhost") {
		baseURL = "http://" + host
	} else {
		baseURL = "https://" + host
	}

	// Start with the root URL
	xml := `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>` + baseURL + `/</loc>
    <lastmod>` + currentDate + `</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

	// Add individual blog posts
	for _, blog := range blogs {
		if blog.Published {
			lastmod := blog.Updated.Format("2006-01-02")
			xml += `
  <url>
    <loc>` + baseURL + `/blogs/` + blog.Slug + `</loc>
    <lastmod>` + lastmod + `</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
		}
	}

	xml += `
</urlset>`

	return xml
}
