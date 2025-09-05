package storage

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"go-react-backend/models"

	"github.com/google/uuid"
)

// FileBlogStore implements BlogStore with file-based storage
type FileBlogStore struct {
	dataDir string
	mu      sync.RWMutex
}

// NewFileBlogStore creates a new file-based blog store
func NewFileBlogStore(dataDir string) (*FileBlogStore, error) {
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create data directory: %w", err)
	}

	store := &FileBlogStore{
		dataDir: dataDir,
	}

	return store, nil
}

// slugify converts a title to a URL-friendly slug
func (s *FileBlogStore) slugify(title string) string {
	// Convert to lowercase and replace spaces with hyphens
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, "_", "-")
	
	// Remove special characters, keep only alphanumeric and hyphens
	var result strings.Builder
	for _, char := range slug {
		if (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == '-' {
			result.WriteRune(char)
		}
	}
	
	// Remove multiple consecutive hyphens
	slug = result.String()
	slug = strings.ReplaceAll(slug, "--", "-")
	slug = strings.Trim(slug, "-")
	
	return slug
}

// getBlogDir returns the directory path for a blog
func (s *FileBlogStore) getBlogDir(slug string) string {
	return filepath.Join(s.dataDir, slug)
}

// getBlogContentPath returns the content file path for a blog
func (s *FileBlogStore) getBlogContentPath(slug string) string {
	return filepath.Join(s.dataDir, slug, "content.md")
}

// getBlogMetadataPath returns the metadata file path for a blog
func (s *FileBlogStore) getBlogMetadataPath(slug string) string {
	return filepath.Join(s.dataDir, slug, "metadata.json")
}

// generateUUID generates a new UUID for blog identification
func (s *FileBlogStore) generateUUID() uuid.UUID {
	return uuid.New()
}

// saveBlog saves a blog to its directory
func (s *FileBlogStore) saveBlog(blog models.Blog, slug string) error {
	blogDir := s.getBlogDir(slug)
	
	// Create blog directory
	if err := os.MkdirAll(blogDir, 0755); err != nil {
		return fmt.Errorf("failed to create blog directory: %w", err)
	}

	// Create metadata
	metadata := map[string]interface{}{
		"id":               blog.ID.String(),
		"slug":             slug,
		"title":            blog.Title,
		"author_name":      blog.AuthorName,
		"author_username":  blog.AuthorUsername,
		"meta_name":        blog.MetaName,
		"meta_description": blog.MetaDescription,
		"created":          blog.Created.Format(time.RFC3339),
		"updated":          blog.Updated.Format(time.RFC3339),
		"published":        blog.Published,
	}

	// Save metadata
	metadataData, err := json.MarshalIndent(metadata, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal metadata: %w", err)
	}

	metadataPath := s.getBlogMetadataPath(slug)
	if err := os.WriteFile(metadataPath, metadataData, 0644); err != nil {
		return fmt.Errorf("failed to write metadata: %w", err)
	}

	// Save content
	contentPath := s.getBlogContentPath(slug)
	if err := os.WriteFile(contentPath, []byte(blog.Content), 0644); err != nil {
		return fmt.Errorf("failed to write content: %w", err)
	}

	return nil
}

// loadAllBlogs loads all blogs from the directory structure
func (s *FileBlogStore) loadAllBlogs() ([]models.Blog, error) {
	entries, err := os.ReadDir(s.dataDir)
	if err != nil {
		return nil, err
	}

	var blogs []models.Blog
	for _, entry := range entries {
		if entry.IsDir() {
			// Check if it's a blog directory (has content.md and metadata.json)
			contentPath := filepath.Join(s.dataDir, entry.Name(), "content.md")
			metadataPath := filepath.Join(s.dataDir, entry.Name(), "metadata.json")
			
			if _, err := os.Stat(contentPath); err == nil {
				if _, err := os.Stat(metadataPath); err == nil {
					// Load metadata
					metadataData, err := os.ReadFile(metadataPath)
					if err != nil {
						continue // Skip this blog if metadata can't be read
					}

					var metadata map[string]interface{}
					if err := json.Unmarshal(metadataData, &metadata); err != nil {
						continue // Skip this blog if metadata can't be parsed
					}

					// Load content
					content, err := os.ReadFile(contentPath)
					if err != nil {
						continue // Skip this blog if content can't be read
					}

					// Parse timestamps from metadata
					var created, updated time.Time
					if createdStr, ok := metadata["created"].(string); ok {
						if parsed, err := time.Parse(time.RFC3339, createdStr); err == nil {
							created = parsed
						} else {
							// Try parsing with a more flexible format
							if parsed, err := time.Parse("2006-01-02T15:04:05-07:00", createdStr); err == nil {
								created = parsed
							} else {
								created = time.Now() // Fallback to current time
							}
						}
					} else {
						created = time.Now() // Fallback to current time
					}
					
					if updatedStr, ok := metadata["updated"].(string); ok {
						if parsed, err := time.Parse(time.RFC3339, updatedStr); err == nil {
							updated = parsed
						} else {
							// Try parsing with a more flexible format
							if parsed, err := time.Parse("2006-01-02T15:04:05-07:00", updatedStr); err == nil {
								updated = parsed
							} else {
								updated = time.Now() // Fallback to current time
							}
						}
					} else {
						updated = time.Now() // Fallback to current time
					}

					// Parse UUID from metadata
					var blogID uuid.UUID
					if idStr, ok := metadata["id"].(string); ok {
						if parsed, err := uuid.Parse(idStr); err == nil {
							blogID = parsed
						} else {
							// Skip this blog if UUID can't be parsed
							continue
						}
					} else {
						// Skip this blog if ID is not a string
						continue
					}

					// Create blog model with metadata
					blog := models.Blog{
						ID:              blogID,
						Title:           metadata["title"].(string),
						Content:         string(content),
						AuthorName:      metadata["author_name"].(string),
						AuthorUsername:  metadata["author_username"].(string),
						MetaName:        metadata["meta_name"].(string),
						MetaDescription: metadata["meta_description"].(string),
						Slug:            metadata["slug"].(string),
						Created:         created,
						Updated:         updated,
						Published:       metadata["published"].(bool),
					}

					blogs = append(blogs, blog)
				}
			}
		}
	}

	// Sort blogs by created date (newest first)
	sort.Slice(blogs, func(i, j int) bool {
		return blogs[i].Created.After(blogs[j].Created)
	})

	return blogs, nil
}

// Interface implementation methods
func (s *FileBlogStore) GetAllBlogs() ([]models.Blog, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.loadAllBlogs()
}


func (s *FileBlogStore) GetBlogBySlug(slug string) (*models.Blog, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	// Load all blogs and find by slug
	blogs, err := s.loadAllBlogs()
	if err != nil {
		return nil, err
	}

	for _, blog := range blogs {
		if blog.Slug == slug {
			return &blog, nil
		}
	}

	return nil, errors.New("blog not found")
}

func (s *FileBlogStore) CreateBlog(blog models.Blog) (models.Blog, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Generate a new UUID for the blog
	blog.ID = s.generateUUID()

	now := time.Now()
	blog.Created = now
	blog.Updated = now

	// Set default metadata if not provided
	if blog.AuthorName == "" {
		blog.AuthorName = "John Doe"
	}
	if blog.AuthorUsername == "" {
		blog.AuthorUsername = "johndoe"
	}
	if blog.MetaName == "" {
		blog.MetaName = blog.Title
	}
	if blog.MetaDescription == "" {
		blog.MetaDescription = fmt.Sprintf("Read about %s", blog.Title)
	}
	if blog.Slug == "" {
		blog.Slug = s.slugify(blog.Title)
	}

	// Save blog in directory structure
	if err := s.saveBlog(blog, blog.Slug); err != nil {
		return models.Blog{}, err
	}

	return blog, nil
}



func (s *FileBlogStore) UpdateBlogBySlug(slug string, updates models.UpdateBlogRequest) (*models.Blog, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Load all blogs and find by slug
	blogs, err := s.loadAllBlogs()
	if err != nil {
		return nil, err
	}

	var existingBlog *models.Blog
	for _, blog := range blogs {
		if blog.Slug == slug {
			existingBlog = &blog
			break
		}
	}

	if existingBlog == nil {
		return nil, errors.New("blog not found")
	}

	// Check slug uniqueness if slug is being updated
	if updates.Slug != nil && *updates.Slug != existingBlog.Slug {
		for _, blog := range blogs {
			if blog.Slug == *updates.Slug && blog.ID != existingBlog.ID {
				return nil, errors.New("slug already exists")
			}
		}
	}

	// Store old slug for folder renaming
	oldSlug := existingBlog.Slug

	// Apply updates
	if updates.Title != nil {
		existingBlog.Title = *updates.Title
	}
	if updates.Content != nil {
		existingBlog.Content = *updates.Content
	}
	if updates.MetaName != nil {
		existingBlog.MetaName = *updates.MetaName
	}
	if updates.MetaDescription != nil {
		existingBlog.MetaDescription = *updates.MetaDescription
	}
	if updates.Slug != nil {
		existingBlog.Slug = *updates.Slug
	}
	if updates.Published != nil {
		existingBlog.Published = *updates.Published
	}
	existingBlog.Updated = time.Now()

	// If slug changed, rename the folder
	if updates.Slug != nil && *updates.Slug != oldSlug {
		oldDir := s.getBlogDir(oldSlug)
		newDir := s.getBlogDir(*updates.Slug)
		
		// Rename the directory
		if err := os.Rename(oldDir, newDir); err != nil {
			return nil, fmt.Errorf("failed to rename blog directory: %w", err)
		}
	}

	// Save updated blog
	if err := s.saveBlog(*existingBlog, slug); err != nil {
		return nil, err
	}

	return existingBlog, nil
}

func (s *FileBlogStore) DeleteBlogBySlug(slug string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Load all blogs and find by slug (without calling GetBlogBySlug to avoid deadlock)
	blogs, err := s.loadAllBlogs()
	if err != nil {
		return err
	}

	// Check if blog exists
	blogExists := false
	for _, blog := range blogs {
		if blog.Slug == slug {
			blogExists = true
			break
		}
	}

	if !blogExists {
		return errors.New("blog not found")
	}

	// Remove entire blog directory
	blogDir := s.getBlogDir(slug)
	if err := os.RemoveAll(blogDir); err != nil {
		return fmt.Errorf("failed to delete blog directory: %w", err)
	}

	return nil
}