package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"go-react-backend/models"
	"go-react-backend/storage"
	"go-react-backend/utils"

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
	var imageData []byte
	var imageFilename string

	// Always expect multipart form data
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10MB
		models.SendError(w, http.StatusBadRequest, "Failed to parse multipart form", err.Error())
		return
	}

	// Parse form fields
	req.Title = r.FormValue("title")
	req.Content = r.FormValue("content")
	req.AuthorName = r.FormValue("author_name")
	req.AuthorUsername = r.FormValue("author_username")
	req.MetaName = r.FormValue("meta_name")
	req.MetaDescription = r.FormValue("meta_description")
	req.Slug = r.FormValue("slug")
	req.Published = r.FormValue("published") == "true"

	// Handle image upload if present
	if file, header, err := r.FormFile("image"); err == nil {
		defer file.Close()
		
		// Validate the file
		if err := utils.ValidateImageFile(header); err != nil {
			fmt.Printf("❌ Image validation failed: %v\n", err)
			models.SendError(w, http.StatusBadRequest, "Invalid image file", err.Error())
			return
		}

		// Process the image
		config := utils.DefaultImageConfig()
		var err error
		imageData, imageFilename, err = utils.ProcessImage(file, header, config)
		if err != nil {
			fmt.Printf("❌ Image processing failed: %v\n", err)
			models.SendError(w, http.StatusInternalServerError, "Failed to process image", err.Error())
			return
		}
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
		Image:           imageFilename,
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

	// Save image if provided - directly in the blog directory
	if imageData != nil && imageFilename != "" {
		blogDir := h.store.(*storage.FileBlogStore).GetBlogDir(createdBlog.Slug)
		imagePath := filepath.Join(blogDir, imageFilename)
		
		// Create blog directory if it doesn't exist
		if err := os.MkdirAll(blogDir, 0755); err != nil {
			fmt.Printf("❌ Failed to create blog directory %s: %v\n", blogDir, err)
		} else {
			// Save image file
			if err := os.WriteFile(imagePath, imageData, 0644); err != nil {
				fmt.Printf("❌ Failed to write image to %s: %v\n", imagePath, err)
			} 
		}
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
	var imageData []byte
	var imageFilename string

	// Always expect multipart form data
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10MB
		models.SendError(w, http.StatusBadRequest, "Failed to parse multipart form", err.Error())
		return
	}

	// Parse form fields (only update non-empty fields)
	if title := r.FormValue("title"); title != "" {
		req.Title = &title
	}
	if content := r.FormValue("content"); content != "" {
		req.Content = &content
	}
	if authorName := r.FormValue("author_name"); authorName != "" {
		req.AuthorName = &authorName
	}
	if authorUsername := r.FormValue("author_username"); authorUsername != "" {
		req.AuthorUsername = &authorUsername
	}
	if metaName := r.FormValue("meta_name"); metaName != "" {
		req.MetaName = &metaName
	}
	if metaDescription := r.FormValue("meta_description"); metaDescription != "" {
		req.MetaDescription = &metaDescription
	}
	if newSlug := r.FormValue("slug"); newSlug != "" {
		req.Slug = &newSlug
	}
	if published := r.FormValue("published"); published != "" {
		publishedBool := published == "true"
		req.Published = &publishedBool
	}

	// Handle image upload if present
	if file, header, err := r.FormFile("image"); err == nil {
		defer file.Close()
		
		// Validate the file
		if err := utils.ValidateImageFile(header); err != nil {
			fmt.Printf("❌ Image validation failed: %v\n", err)
			models.SendError(w, http.StatusBadRequest, "Invalid image file", err.Error())
			return
		}

		// Process the image
		config := utils.DefaultImageConfig()
		var err error
		imageData, imageFilename, err = utils.ProcessImage(file, header, config)
		if err != nil {
			fmt.Printf("❌ Image processing failed: %v\n", err)
			models.SendError(w, http.StatusInternalServerError, "Failed to process image", err.Error())
			return
		}
		
		// Save the image directly to the blog's directory
		blogDir := h.store.(*storage.FileBlogStore).GetBlogDir(slug)
		imagePath := filepath.Join(blogDir, imageFilename)
		
		// Create blog directory if it doesn't exist
		if err := os.MkdirAll(blogDir, 0755); err != nil {
			fmt.Printf("❌ Failed to create blog directory %s: %v\n", blogDir, err)
			models.SendError(w, http.StatusInternalServerError, "Failed to save image", err.Error())
			return
		}
		
		// Save image file
		if err := os.WriteFile(imagePath, imageData, 0644); err != nil {
			fmt.Printf("❌ Failed to write image to %s: %v\n", imagePath, err)
			models.SendError(w, http.StatusInternalServerError, "Failed to save image", err.Error())
			return
		}
		
		req.Image = &imageFilename
	}

	// Validate that at least one field is being updated
	if req.Title == nil && req.Content == nil && req.Image == nil && req.MetaName == nil && req.MetaDescription == nil && req.Slug == nil && req.Published == nil {
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

	// Save image if provided
	if imageData != nil && imageFilename != "" {
		if err := h.store.SaveBlogImage(updatedBlog.Slug, imageFilename, imageData); err != nil {
			// Log error but don't fail the request - blog was updated successfully
			fmt.Printf("Warning: Failed to save image for blog %s: %v\n", updatedBlog.Slug, err)
		}
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


// ServeImage serves image files for blogs
func (h *BlogHandler) ServeImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]
	filename := vars["filename"]

	if slug == "" || filename == "" {
		fmt.Printf("❌ Missing slug or filename\n")
		models.SendError(w, http.StatusBadRequest, "Missing slug or filename", "")
		return
	}

	// Validate filename to prevent directory traversal
	if filepath.Base(filename) != filename {
		models.SendError(w, http.StatusBadRequest, "Invalid filename", "")
		return
	}

	// Get the blog to verify it exists and get the image
	blog, err := h.store.GetBlogBySlug(slug)
	if err != nil {
		fmt.Printf("❌ Blog not found: %v\n", err)
		models.SendError(w, http.StatusNotFound, "Blog not found", "")
		return
	}

	// Check if the requested image matches the blog's image
	if blog.Image != filename {
		fmt.Printf("❌ Image mismatch: blog has '%s', requested '%s'\n", blog.Image, filename)
		models.SendError(w, http.StatusNotFound, "Image not found", "")
		return
	}

	// Read the image file from storage
	blogDir := h.store.(*storage.FileBlogStore).GetBlogDir(slug)
	imagePath := filepath.Join(blogDir, filename)
	
	// Check if file exists
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		fmt.Printf("❌ Image file not found: %s\n", imagePath)
		// Prevent caching of 404 responses
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		models.SendError(w, http.StatusNotFound, "Image file not found", "")
		return
	}
	
	// Set appropriate headers
	w.Header().Set("Content-Type", utils.GetImageMimeType())
	w.Header().Set("Cache-Control", "public, max-age=31536000") // 1 year cache
	w.Header().Set("ETag", fmt.Sprintf("\"%s-%s\"", slug, filename)) // ETag for cache validation
	w.Header().Set("Last-Modified", time.Now().Format(http.TimeFormat)) // Last modified
	
	// Serve the file
	http.ServeFile(w, r, imagePath)
}

