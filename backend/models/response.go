package models

import (
	"encoding/json"
	"net/http"
	"time"
)

// Response represents a generic API response
type Response struct {
	Message   string      `json:"message"`
	Timestamp time.Time   `json:"timestamp"`
	Data      interface{} `json:"data,omitempty"`
	Error     string      `json:"error,omitempty"`
}

// SuccessResponse creates a success response
func SuccessResponse(message string, data interface{}) Response {
	return Response{
		Message:   message,
		Timestamp: time.Now(),
		Data:      data,
	}
}

// ErrorResponse creates an error response
func ErrorResponse(message string, err string) Response {
	return Response{
		Message:   message,
		Timestamp: time.Now(),
		Error:     err,
	}
}

// SendJSON sends a JSON response with proper headers
func SendJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

// SendSuccess sends a success response
func SendSuccess(w http.ResponseWriter, statusCode int, message string, data interface{}) {
	response := SuccessResponse(message, data)
	SendJSON(w, statusCode, response)
}

// SendError sends an error response
func SendError(w http.ResponseWriter, statusCode int, message string, err string) {
	response := ErrorResponse(message, err)
	SendJSON(w, statusCode, response)
}
