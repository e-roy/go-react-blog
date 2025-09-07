package handlers

import (
	"encoding/json"
	"net/http"

	"go-react-backend/models"

	"github.com/gorilla/mux"
)

// BlogHandler handles blog-related HTTP requests
type BlogHandler struct {
	store models.BlogStore
}

// NewBlogHandler creates a new blog handler
func NewBlogHandler(store models.BlogStore) *BlogHandler {
	return &BlogHandler{store: store}
}




// CreateBlog creates a new blog
func (h *BlogHandler) CreateBlog(w http.ResponseWriter, r *http.Request) {
	var req models.CreateBlogRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.SendError(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	// Validate request
	if err := req.Validate(); err != nil {
		if validationErr, ok := err.(*models.ValidationError); ok {
			models.SendError(w, http.StatusBadRequest, "Validation failed", validationErr.Error())
		} else {
			models.SendError(w, http.StatusBadRequest, "Validation failed", err.Error())
		}
		return
	}

	// Create blog with all metadata fields
	newBlog := models.Blog{
		Title:           req.Title,
		Content:         req.Content,
		AuthorName:      req.AuthorName,
		AuthorUsername:  req.AuthorUsername,
		MetaName:        req.MetaName,
		MetaDescription: req.MetaDescription,
		Slug:            req.Slug,
		Published:       req.Published,
	}

	createdBlog, err := h.store.CreateBlog(newBlog)
	if err != nil {
		models.SendError(w, http.StatusInternalServerError, "Failed to create blog", err.Error())
		return
	}

	models.SendSuccess(w, http.StatusCreated, "Blog created successfully", createdBlog.ToResponse())
}



// UpdateBlogBySlug updates an existing blog by slug
func (h *BlogHandler) UpdateBlogBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	if slug == "" {
		models.SendError(w, http.StatusBadRequest, "Invalid blog slug", "Slug is required")
		return
	}

	var req models.UpdateBlogRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		models.SendError(w, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	// Validate that at least one field is being updated
	if req.Title == nil && req.Content == nil && req.MetaName == nil && req.MetaDescription == nil && req.Slug == nil && req.Published == nil {
		models.SendError(w, http.StatusBadRequest, "No fields to update", "At least one field must be provided")
		return
	}

	// Update blog by slug
	updatedBlog, err := h.store.UpdateBlogBySlug(slug, req)
	if err != nil {
		if err.Error() == "blog not found" {
			models.SendError(w, http.StatusNotFound, "Blog not found", err.Error())
		} else if err.Error() == "slug already exists" {
			models.SendError(w, http.StatusConflict, "Slug already exists", err.Error())
		} else {
			models.SendError(w, http.StatusInternalServerError, "Failed to update blog", err.Error())
		}
		return
	}

	models.SendSuccess(w, http.StatusOK, "Blog updated successfully", updatedBlog.ToResponse())
}

// DeleteBlogBySlug deletes a blog by slug
func (h *BlogHandler) DeleteBlogBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	if slug == "" {
		models.SendError(w, http.StatusBadRequest, "Invalid blog slug", "Slug is required")
		return
	}

	err := h.store.DeleteBlogBySlug(slug)
	if err != nil {
		if err.Error() == "blog not found" {
			models.SendError(w, http.StatusNotFound, "Blog not found", err.Error())
		} else {
			models.SendError(w, http.StatusInternalServerError, "Failed to delete blog", err.Error())
		}
		return
	}

	models.SendSuccess(w, http.StatusOK, "Blog deleted successfully", nil)
}

