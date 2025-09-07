# Go Backend

This is a well-structured Go HTTP server that provides server-side rendering (SSR) and a REST API for the React frontend. The codebase follows Go best practices with proper separation of concerns and includes a complete blog management system with embedded data.

## Features

- **HTTP Server**: Built with Go's standard `net/http` package
- **Server-Side Rendering**: HTML templates with embedded data for instant loading
- **Router**: Uses `gorilla/mux` for flexible routing
- **CORS Support**: Configured to work with the React frontend
- **JSON API**: RESTful endpoints returning JSON responses
- **File-Based Storage**: Blog content stored as markdown files with JSON metadata
- **SEO-Friendly URLs**: All blog operations use human-readable slugs for optimal SEO
- **Rich Metadata**: Comprehensive blog metadata including author info and SEO fields
- **SEO Optimization**: Meta tags, canonical URLs, Open Graph, and XML sitemaps
- **Clean Architecture**: Well-organized code structure with separate packages and simplified API design
- **Middleware Support**: CORS and logging middleware
- **Interface-based Design**: Storage layer uses interfaces for flexibility
- **Concurrency Safe**: Thread-safe operations with proper mutex usage
- **Type Generation**: Automatic TypeScript type generation for frontend consistency
- **Dynamic Asset Loading**: Automatic detection of built frontend assets
- **Development Mode**: Hot reloading support with Vite dev server integration

## Project Structure

```
backend/
├── go.mod              # Go module definition and dependencies
├── go.sum              # Go module checksums
├── main.go             # Main server file with SSR and routing
├── models/             # Data structures and response helpers
│   ├── blog.go         # Blog structs, validation, and BlogStore interface
│   └── response.go     # API response utilities
├── handlers/           # HTTP request handlers
│   └── blog_handlers.go # Blog CRUD operations
├── storage/            # Data persistence layer
│   └── blog_storage.go # File-based blog storage with metadata
├── routes/             # API routing configuration
│   └── routes.go       # Route definitions
├── middleware/         # HTTP middleware
│   └── cors.go         # CORS and logging middleware
├── templates/          # HTML templates for SSR
│   ├── index.html      # Home page template
│   ├── blog.html       # Blog post template
│   ├── edit.html       # Edit page template
│   ├── new.html        # New blog template
│   └── notfound.html   # 404 page template
├── tools/              # Development and build tools
│   └── generate-types.go # TypeScript type generator
├── generate-types.bat  # Windows batch script for type generation
├── generate-types.ps1  # PowerShell script for type generation
├── data/               # Blog data storage (created at runtime)
│   └── {slug}/         # Individual blog directories
│       ├── content.md  # Markdown content
│       └── metadata.json # Blog metadata
└── README.md           # This file
```

## Type Generation System

The backend includes an automated type generation system that creates TypeScript interfaces from Go structs, ensuring perfect type consistency between frontend and backend.

### How It Works

The type generator (`tools/generate-types.go`) parses Go structs in the `models/` directory and generates corresponding TypeScript interfaces with:

- **Automatic Type Mapping**: Go types → TypeScript types (e.g., `uuid.UUID` → `string`, `time.Time` → `string`)
- **JSON Tag Processing**: Extracts field names from JSON tags for accurate API contract
- **JSON Tag Preservation**: Maintains exact field names from JSON tags for API consistency
- **Comment Preservation**: Maintains Go struct comments as TypeScript interface documentation
- **Smart Filtering**: Only generates types for public API structs (Response types, main entities)

### Generated Types

The system automatically generates TypeScript interfaces for:

```typescript
// Auto-generated from Go backend
export interface Blog {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_username: string;
  meta_name: string;
  meta_description: string;
  slug: string;
  created: string;
  updated: string;
  published: boolean;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  author_name: string;
  author_username: string;
  meta_name: string;
  meta_description: string;
  slug: string;
  published: boolean;
}

export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_username: string;
  meta_name: string;
  meta_description: string;
  slug: string;
  created: string;
  updated: string;
  published: boolean;
}
```

### Using the Type Generator

#### Quick Generation

```bash
cd backend
go run tools/generate-types.go
```

#### Using Scripts

```bash
# Windows
./generate-types.bat

# PowerShell
./generate-types.ps1
```

#### Custom Output Directory

```bash
go run tools/generate-types.go -output ../frontend/app/types
```

### Benefits

1. **🔄 Automatic Sync**: Types stay in sync when backend changes
2. **🎯 Single Source of Truth**: Backend defines the data contract
3. **🔧 Easy Maintenance**: Run generator to update types after backend changes
4. **📝 Type Safety**: Full TypeScript support with accurate types
5. **🔄 Consistency**: Frontend and backend use the same field names
6. **📈 Scalability**: Easy to add new models and generate types

### Workflow

1. **Add/Modify Go Structs** in `models/` directory
2. **Run Type Generator**: `go run tools/generate-types.go`
3. **Frontend Gets New Types** automatically in `frontend/app/types/generated.ts`
4. **Update Frontend Code** to use new fields/types

### Example: Adding a New Field

```go
// In backend/models/blog.go
type Blog struct {
    ID              uuid.UUID `json:"id"`
    Title           string    `json:"title"`
    Content         string    `json:"content"`
    AuthorName      string    `json:"author_name"`
    // Add new field
    Category        string    `json:"category"`  // New field
    // ... existing fields
}
```

After adding the field:

```bash
go run tools/generate-types.go
```

Frontend automatically gets:

```typescript
export interface Blog {
  id: string;
  title: string;
  content: string;
  author_name: string;
  category: string; // New field automatically available
  // ... existing fields
}
```

## API Endpoints

### Health & Status

- `GET /api/health` - Health check endpoint with feature status

### Blogs (Write Operations)

- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs/{slug}` - Update blog by slug
- `DELETE /api/blogs/{slug}` - Delete blog by slug

### Server-Side Rendered Routes

- `GET /` - Home page with all blogs (SSR with embedded data)
- `GET /blogs/{slug}` - Individual blog post (SSR with embedded data)
- `GET /blogs/new` - New blog form
- `GET /blogs/{slug}/edit` - Edit blog form
- `GET /sitemap.xml` - XML sitemap for SEO

## Blog Storage Architecture

The blog system uses a sophisticated file-based storage approach:

### Directory Structure

```
data/
├── {slug}/
│   ├── content.md      # Markdown content of the blog post
│   └── metadata.json   # JSON metadata with author, SEO, and timestamps
```

### Blog Metadata Fields

- **Content**: `content.md` - Markdown-formatted blog content
- **Metadata**: `metadata.json` - Rich metadata including:
  - `id`: Unique blog identifier
  - `title`: Blog post title
  - `author_name`: Author's full name
  - `author_username`: Author's username
  - `meta_name`: SEO meta title
  - `meta_description`: SEO meta description
  - `slug`: URL-friendly identifier
  - `created`: Creation timestamp
  - `updated`: Last update timestamp
  - `published`: Publication status

### SEO Benefits

- **Human-readable URLs**: `/blogs/welcome-to-our-blog-platform`
- **Rich metadata**: Complete author and SEO information
- **Markdown support**: Rich content formatting
- **Slug-based routing**: All blog operations use SEO-friendly slugs

## API Design Philosophy

The API is designed with simplicity and SEO-friendliness in mind:

- **Slug-only operations**: All blog interactions use human-readable slugs instead of internal IDs
- **SEO-optimized URLs**: Blog URLs are meaningful and search-engine friendly
- **Reduced complexity**: No duplicate endpoints for ID vs slug-based operations
- **Frontend alignment**: API design matches frontend usage patterns exactly
- **Internal tracking**: IDs are still maintained in metadata for internal purposes

This design eliminates redundant code while providing a clean, intuitive API that's optimized for both developers and search engines.

## Getting Started

### Prerequisites

- Go 1.21 or later installed on your system
- You can download it from [golang.org](https://golang.org/dl/)

### Development Mode (Hot Reloading)

For development with hot reloading:

```bash
# Start both backend and frontend
.\dev.bat           # Windows
# or
./dev.sh            # Linux/Mac
```

This will start:

- **Go backend** on http://localhost:8080 (with SSR and embedded data)
- **Vite dev server** on http://localhost:5173 (for hot reloading)

### Manual Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Download dependencies:

   ```bash
   go mod tidy
   ```

3. Run the server:

   ```bash
   go run main.go
   ```

   **Note for PowerShell users**: If you encounter issues with `&&` syntax, use separate commands:

   ```powershell
   cd backend
   go run main.go
   ```

4. The server will start on port 8080:
   - API: http://localhost:8080/api
   - Health check: http://localhost:8080/api/health
   - SSR Pages: http://localhost:8080/ (home), http://localhost:8080/blogs/{slug}
   - Sitemap: http://localhost:8080/sitemap.xml
   - Blog data stored in: `data/` directory

### Environment Variables

- `PORT`: Server port (defaults to 8080)
- `BLOG_DATA_DIR`: Custom blog data directory path (optional)

## Go Concepts Used

### 1. **Package Organization**

```go
// Each package has a specific responsibility
models/      // Data structures and interfaces
handlers/    // HTTP request processing
storage/     // Data persistence (file-based for blogs)
routes/      // API endpoint configuration
middleware/  // Cross-cutting concerns
tools/       // Development utilities (type generation)
```

This follows Go's convention of organizing code by functionality.

### 2. **Interfaces**

```go
type BlogStore interface {
    GetAllBlogs() ([]Blog, error)
    GetBlogBySlug(slug string) (*Blog, error)
    CreateBlog(blog Blog) (Blog, error)
    UpdateBlogBySlug(slug string, updates UpdateBlogRequest) (*Blog, error)
    DeleteBlogBySlug(slug string) error
}
```

Interfaces define contracts that implementations must fulfill, enabling dependency injection and testing.

### 3. **Structs and Methods**

```go
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

func (b *Blog) ToResponse() BlogResponse {
    // Method on Blog struct
}
```

Go uses composition over inheritance. Methods are attached to structs using receiver syntax.

### 4. **HTTP Handlers**

```go
func (h *BlogHandler) GetBlogBySlug(w http.ResponseWriter, r *http.Request) {
    // Handler method with proper error handling and slug-based routing
}
```

HTTP handlers implement the standard `http.HandlerFunc` interface and use dependency injection.

### 5. **Middleware Pattern**

```go
handler := middleware.SetupCORS()(router)
handler = middleware.LoggingMiddleware(handler)
```

Middleware functions wrap HTTP handlers to add cross-cutting functionality like CORS and logging.

### 6. **Error Handling**

```go
if err != nil {
    models.SendError(w, http.StatusBadRequest, "Invalid request", err.Error())
    return
}
```

Go uses explicit error handling. Functions return errors that must be checked and handled appropriately.

### 7. **Concurrency Safety**

```go
type FileBlogStore struct {
    dataDir string
    mu      sync.RWMutex  // Read-write mutex for thread safety
}
```

The storage layer uses mutexes to ensure thread-safe access to shared data, especially important for file operations.

### 8. **File I/O Operations**

```go
// Reading files
content, err := os.ReadFile(contentPath)
metadataData, err := os.ReadFile(metadataPath)

// Writing files
err := os.WriteFile(filePath, []byte(content), 0644)

// Directory operations
entries, err := os.ReadDir(dataDir)
err := os.MkdirAll(blogDir, 0755)
```

The blog storage system demonstrates Go's powerful file I/O capabilities for building file-based data stores.

### 9. **AST Parsing and Code Generation**

```go
// Parse Go files
fset := token.NewFileSet()
node, err := parser.ParseFile(fset, path, nil, parser.ParseComments)

// Extract struct information
if structType, ok := typeSpec.Type.(*ast.StructType); ok {
    // Process struct fields and generate TypeScript
}
```

The type generator uses Go's `go/ast` package to parse Go source code and extract type information for TypeScript generation.

## Code Organization Benefits

### **Separation of Concerns**

- **Models**: Define data structures, validation, and interfaces
- **Handlers**: Process HTTP requests and responses
- **Storage**: Manage data persistence (file-based for blogs)
- **Routes**: Configure API endpoints with slug-based routing
- **Middleware**: Handle cross-cutting concerns
- **Tools**: Development utilities for type generation and build processes

### **Maintainability**

- Easy to locate specific functionality
- Simple to modify individual components
- Clear dependencies between packages
- Consistent patterns throughout the codebase
- Automated type synchronization between frontend and backend

### **Testability**

- Each package can be tested independently
- Interfaces enable easy mocking
- Clear boundaries between components
- Dependency injection for testing

### **Scalability**

- Easy to add new features (blogs, comments, etc.)
- Simple to swap implementations (e.g., database vs. file-based)
- Clear patterns for new developers
- Professional structure for production
- Automated type generation scales with new models

## Deployment Considerations

### **Railway Deployment**

The current structure is optimized for Railway deployment:

- **Data directory**: Uses relative `data/` path (perfect for Railway)
- **Environment variables**: Supports `BLOG_DATA_DIR` for custom paths
- **File-based storage**: No database dependencies for blogs
- **Static file serving**: Built-in support for serving React frontend
- **Type generation**: Can be run during build process for type consistency

### **Production Considerations**

- **Data persistence**: Blog files are stored in the `data/` directory
- **File permissions**: Proper file permissions (0644 for files, 0755 for directories)
- **Error handling**: Comprehensive error handling for file operations
- **Concurrency**: Thread-safe operations for production use
- **Type generation**: Consider running type generation in CI/CD pipeline

## Next Steps

- **Database Integration**: Add PostgreSQL/MySQL for production scalability
- **Authentication**: Implement authentication and authorization for blog management
- **Input Validation**: Add comprehensive validation with proper libraries
- **File Uploads**: Support for image uploads and media management
- **Search & Filtering**: Implement blog search and category filtering
- **Caching**: Add Redis caching for improved performance
- **Monitoring**: Comprehensive logging and monitoring
- **Testing**: Unit and integration tests
- **API Documentation**: Swagger/OpenAPI documentation
- **Rate Limiting**: Security middleware and rate limiting
- **Enhanced Type Generation**: Add support for more complex Go types and validation rules

## Useful Go Commands

- `go mod tidy` - Download dependencies and clean up
- `go run main.go` - Run the program
- `go build` - Build an executable
- `go test ./...` - Run tests in all packages
- `go fmt ./...` - Format code in all packages
- `go vet ./...` - Check for common mistakes
- `go mod graph` - View dependency graph
- `go list -m all` - List all module dependencies
- `go mod verify` - Verify dependencies
- `go clean -modcache` - Clean module cache
- `go clean` - Remove build artifacts (like compiled binaries)

### **Type Generation Commands**

- `go run tools/generate-types.go` - Generate TypeScript types
- `go run tools/generate-types.go -output ../frontend/app/types` - Custom output directory
- `./generate-types.ps1` - PowerShell script for type generation
- `./generate-types.bat` - Windows batch script for type generation
