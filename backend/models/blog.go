package models

import (
	"time"

	"github.com/google/uuid"
)

// BlogStore represents the storage interface for blogs
type BlogStore interface {
	GetAllBlogs() ([]Blog, error)
	GetBlogBySlug(slug string) (*Blog, error)
	CreateBlog(blog Blog) (Blog, error)
	UpdateBlogBySlug(slug string, updates UpdateBlogRequest) (*Blog, error)
	DeleteBlogBySlug(slug string) error
}

// Blog represents a blog post in the system
type Blog struct {
	ID              uuid.UUID `json:"id"`
	Title           string    `json:"title"`
	Content         string    `json:"content"`
	AuthorName      string    `json:"author_name"`
	AuthorUsername  string    `json:"author_username"`
	MetaName        string    `json:"meta_name"`
	MetaDescription string    `json:"meta_description"`
	Slug            string    `json:"slug"`
	Created         time.Time `json:"created"`
	Updated         time.Time `json:"updated"`
	Published       bool      `json:"published"`
}

// CreateBlogRequest represents the data needed to create a blog
type CreateBlogRequest struct {
	Title           string `json:"title" validate:"required"`
	Content         string `json:"content" validate:"required"`
	AuthorName      string `json:"author_name"`
	AuthorUsername  string `json:"author_username"`
	MetaName        string `json:"meta_name"`
	MetaDescription string `json:"meta_description"`
	Slug            string `json:"slug"`
	Published       bool   `json:"published"`
}

// UpdateBlogRequest represents the data needed to update a blog
type UpdateBlogRequest struct {
	Title           *string `json:"title,omitempty"`
	Content         *string `json:"content,omitempty"`
	MetaName        *string `json:"meta_name,omitempty"`
	MetaDescription *string `json:"meta_description,omitempty"`
	Slug            *string `json:"slug,omitempty"`
	Published       *bool   `json:"published,omitempty"`
}

// BlogResponse represents the blog data sent to clients
type BlogResponse struct {
	ID              string `json:"id"`
	Title           string `json:"title"`
	Content         string `json:"content"`
	AuthorName      string `json:"author_name"`
	AuthorUsername  string `json:"author_username"`
	MetaName        string `json:"meta_name"`
	MetaDescription string `json:"meta_description"`
	Slug            string `json:"slug"`
	Created         string `json:"created"`
	Updated         string `json:"updated"`
	Published       bool   `json:"published"`
}

// Convert Blog to BlogResponse
func (b *Blog) ToResponse() BlogResponse {
	return BlogResponse{
		ID:              b.ID.String(),
		Title:           b.Title,
		Content:         b.Content,
		AuthorName:      b.AuthorName,
		AuthorUsername:  b.AuthorUsername,
		MetaName:        b.MetaName,
		MetaDescription: b.MetaDescription,
		Slug:            b.Slug,
		Created:         b.Created.Format(time.RFC3339),
		Updated:         b.Updated.Format(time.RFC3339),
		Published:       b.Published,
	}
}

// ValidateCreateRequest validates a create blog request
func (req *CreateBlogRequest) Validate() error {
	if req.Title == "" {
		return &ValidationError{Field: "title", Message: "Title is required"}
	}
	if req.Content == "" {
		return &ValidationError{Field: "content", Message: "Content is required"}
	}
	return nil
}

// ValidationError represents a validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func (e *ValidationError) Error() string {
	return e.Message
}
