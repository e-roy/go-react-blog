package routes

import (
	"encoding/json"
	"net/http"
	"time"

	"go-react-backend/handlers"

	"github.com/gorilla/mux"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(blogHandler *handlers.BlogHandler) *mux.Router {
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	
	// Health check endpoint
	api.HandleFunc("/health", healthHandler).Methods("GET")
	
	// Blog endpoints (write operations only - read data is embedded in HTML)
	api.HandleFunc("/blogs", blogHandler.CreateBlog).Methods("POST")
	api.HandleFunc("/blogs/{slug}", blogHandler.UpdateBlogBySlug).Methods("PUT")
	api.HandleFunc("/blogs/{slug}", blogHandler.DeleteBlogBySlug).Methods("DELETE")

	return r
}

// healthHandler returns a simple health check response
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	
	response := map[string]interface{}{
		"message":   "Go backend is healthy! 🟢",
		"timestamp": time.Now().Format(time.RFC3339),
		"status":    "ok",
		"features":  []string{"blogs", "file-storage"},
	}
	
	// Simple JSON response for health check
	json.NewEncoder(w).Encode(response)
}
