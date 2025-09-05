package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

// SetupCORS configures CORS middleware
func SetupCORS() func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all origins in production
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})
	
	return c.Handler
}

// LoggingMiddleware logs HTTP requests
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Log the request
		// In a real app, you'd use a proper logging library
		// For now, we'll just print to console
		println("🌐", r.Method, r.URL.Path, r.RemoteAddr)
		
		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
