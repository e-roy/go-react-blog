package utils

import (
	"bytes"
	"fmt"
	"image"
	_ "image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"path/filepath"
	"strings"

	"golang.org/x/image/draw"
)

// ImageConfig holds configuration for image processing
type ImageConfig struct {
	MaxWidth    int
	MaxHeight   int
}

// DefaultImageConfig returns default configuration for blog images
func DefaultImageConfig() ImageConfig {
	return ImageConfig{
		MaxWidth:  1200,
		MaxHeight: 800,
	}
}

// ProcessImage processes an uploaded image file and returns optimized image data
func ProcessImage(file multipart.File, header *multipart.FileHeader, config ImageConfig) ([]byte, string, error) {
	// Read the file data
	fileData, err := io.ReadAll(file)
	if err != nil {
		return nil, "", fmt.Errorf("failed to read file: %w", err)
	}

	// Decode the image
	img, _, err := image.Decode(bytes.NewReader(fileData))
	if err != nil {
		return nil, "", fmt.Errorf("failed to decode image: %w", err)
	}

	// Resize image if needed
	resizedImg := resizeImage(img, config.MaxWidth, config.MaxHeight)

	// Convert to PNG
	pngData, err := encodePNG(resizedImg)
	if err != nil {
		return nil, "", fmt.Errorf("failed to encode PNG: %w", err)
	}

	// Generate filename
	filename := generateImageFilename(header.Filename, "png")

	return pngData, filename, nil
}


// resizeImage resizes an image while maintaining aspect ratio
func resizeImage(img image.Image, maxWidth, maxHeight int) image.Image {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Calculate new dimensions while maintaining aspect ratio
	newWidth, newHeight := calculateDimensions(width, height, maxWidth, maxHeight)

	// If no resize needed, return original
	if newWidth == width && newHeight == height {
		return img
	}

	// Create new image with calculated dimensions
	resized := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
	
	// Use high-quality scaling
	draw.CatmullRom.Scale(resized, resized.Bounds(), img, bounds, draw.Over, nil)

	return resized
}

// calculateDimensions calculates new dimensions while maintaining aspect ratio
func calculateDimensions(width, height, maxWidth, maxHeight int) (int, int) {
	// Calculate scaling factors
	scaleX := float64(maxWidth) / float64(width)
	scaleY := float64(maxHeight) / float64(height)

	// Use the smaller scaling factor to ensure image fits within bounds
	scale := scaleX
	if scaleY < scaleX {
		scale = scaleY
	}

	// Calculate new dimensions
	newWidth := int(float64(width) * scale)
	newHeight := int(float64(height) * scale)

	return newWidth, newHeight
}

// encodePNG encodes an image to PNG format
func encodePNG(img image.Image) ([]byte, error) {
	var buf bytes.Buffer
	
	// Encode to PNG
	err := png.Encode(&buf, img)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// generateImageFilename generates a unique filename for the image
func generateImageFilename(originalFilename, newFormat string) string {
	// Get file extension without dot
	ext := filepath.Ext(originalFilename)
	if ext != "" {
		ext = ext[1:] // Remove the dot
	}
	
	// Generate unique filename
	baseName := strings.TrimSuffix(originalFilename, "."+ext)
	if baseName == "" {
		baseName = "image"
	}
	
	// Clean filename (remove special characters)
	baseName = cleanFilename(baseName)
	
	return fmt.Sprintf("%s.%s", baseName, newFormat)
}

// cleanFilename removes special characters from filename
func cleanFilename(filename string) string {
	// Replace spaces and special characters with underscores
	cleaned := strings.ReplaceAll(filename, " ", "_")
	cleaned = strings.ReplaceAll(cleaned, "-", "_")
	
	// Remove any remaining special characters
	var result strings.Builder
	for _, char := range cleaned {
		if (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || 
		   (char >= '0' && char <= '9') || char == '_' {
			result.WriteRune(char)
		}
	}
	
	return result.String()
}

// GetImageMimeType returns the MIME type for PNG images
func GetImageMimeType() string {
	return "image/png"
}

// ValidateImageFile validates an uploaded image file
func ValidateImageFile(header *multipart.FileHeader) error {
	// Check file size (max 10MB)
	const maxSize = 10 * 1024 * 1024 // 10MB
	if header.Size > maxSize {
		return fmt.Errorf("image file too large: %d bytes (max %d bytes)", header.Size, maxSize)
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(header.Filename))
	validExts := []string{".jpg", ".jpeg", ".png", ".webp"}
	
	for _, validExt := range validExts {
		if ext == validExt {
			return nil
		}
	}

	return fmt.Errorf("unsupported file type: %s", ext)
}
