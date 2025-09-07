# Go + React Blog Platform

A lightweight, full-stack blog platform built with **Go** for the backend and **React + TypeScript + Vite + Tailwind CSS** for the frontend. Features server-side rendering (SSR) with embedded data for optimal performance and SEO. This project serves as both a practical blog solution and a learning journey for Go development.

## 🚀 Features

- **Backend**: Go HTTP server with file-based storage (no database required)
- **Frontend**: Modern React application with TypeScript
- **Server-Side Rendering (SSR)**: Go backend serves fully rendered HTML with embedded data
- **Blog Management**: Create, edit, and delete blog posts through web interface
- **SEO-Friendly**: Human-readable URLs, canonical links, and comprehensive meta tags
- **Social Media Ready**: Open Graph and Twitter Card meta tags for rich sharing
- **Markdown Support**: Rich text editing with live preview
- **Type Safety**: Auto-generated TypeScript types from Go backend
- **File Storage**: Markdown content with JSON metadata
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Hot Reloading**: Development mode with Vite dev server integration
- **Low Cost**: Designed for Railway deployment without database dependencies

## 🏗️ Project Structure

```
go-react/
├── backend/                 # Go backend server
│   ├── models/             # Data structures and interfaces
│   ├── handlers/           # HTTP request handlers
│   ├── storage/            # File-based blog storage
│   ├── routes/             # API routing configuration
│   ├── middleware/         # CORS and logging middleware
│   ├── templates/          # HTML templates for SSR
│   │   ├── index.html      # Home page template
│   │   ├── blog.html       # Blog post template
│   │   ├── edit.html       # Edit page template
│   │   └── new.html        # New blog template
│   ├── tools/              # TypeScript type generator
│   ├── data/               # Blog content storage
│   │   └── {slug}/         # Individual blog directories
│   │       ├── content.md  # Markdown content
│   │       └── metadata.json # Blog metadata
│   ├── go.mod              # Go module definition
│   ├── main.go             # Main server file
│   └── README.md           # Backend documentation
├── frontend/                # React frontend application
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components (no client-side routing)
│   │   ├── lib/            # API client and utilities
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # React entry point
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration with proxy
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend

- **Go 1.22+** - Programming language
- **Gorilla Mux** - HTTP router and URL matcher
- **HTML Templates** - Server-side rendering with Go templates
- **File-based Storage** - Markdown + JSON metadata (no database)
- **UUID** - Unique identifiers for blog posts
- **CORS** - Cross-origin resource sharing support
- **Type Generation** - Automatic TypeScript type generation
- **Dynamic Asset Loading** - Automatic detection of built frontend assets

### Frontend

- **React 19** - Modern React with hooks and patterns
- **TypeScript** - Type safety with auto-generated types
- **Vite** - Fast build tool and dev server with hot reloading
- **Tailwind CSS** - Utility-first CSS framework
- **Embedded Data** - Server-side data injection for instant loading
- **Axios** - HTTP client for API calls

## 🚀 Quick Start

### Prerequisites

- **Go 1.22+** - [Download here](https://golang.org/dl/)
- **Node.js 18+** - [Download here](https://nodejs.org/)

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

### Production Mode

For production testing:

```bash
# Build and run with Docker
docker build -t go-react-app .
docker run -p 8080:8080 go-react-app
```

### Manual Setup

1. **Start the Go Backend**

```bash
cd backend
go mod tidy          # Download dependencies
go run main.go       # Start the server
```

2. **Start the React Frontend** (for development)

```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
```

### Access the Application

- **Development**: http://localhost:8080 (Go backend with SSR)
- **Hot Reloading**: http://localhost:5173 (Vite dev server)
- **Production**: http://localhost:8080 (Docker container)

## 📡 API Endpoints

The Go backend provides these REST endpoints:

- `GET /api/health` - Health check
- `POST /api/blogs` - Create a new blog post
- `PUT /api/blogs/{slug}` - Update blog post by slug
- `DELETE /api/blogs/{slug}` - Delete blog post by slug

### Server-Side Rendered Routes

- `GET /` - Home page with all blogs (SSR with embedded data)
- `GET /blogs/{slug}` - Individual blog post (SSR with embedded data)
- `GET /blogs/new` - New blog form
- `GET /blogs/{slug}/edit` - Edit blog form
- `GET /sitemap.xml` - XML sitemap for SEO

## 🎯 What You'll Learn

### Go Backend

- HTTP server setup with Go
- Server-side rendering (SSR) with HTML templates
- File-based storage (no database required)
- RESTful API design with slug-based routing
- JSON handling and structs
- Interface-based architecture
- Error handling patterns
- Concurrency with goroutines and mutexes
- Type generation for frontend integration
- Middleware (CORS, logging)
- Dynamic asset loading and template rendering
- SEO optimization with meta tags and sitemaps

### React Frontend

- Modern React 19 with hooks
- TypeScript integration with auto-generated types
- API communication with Axios
- Markdown editing and preview
- Form handling and validation
- Responsive UI design with Tailwind CSS
- State management (no client-side routing)
- Component composition and reusability
- Embedded data consumption from SSR

### Full-Stack Integration

- Type-safe API communication
- Automatic type synchronization
- SEO-friendly URL structure with server-side rendering
- File-based content management
- Embedded data injection for instant loading
- Development mode with hot reloading
- Production optimization with Docker
- Railway deployment preparation

## 🔧 Development

### Backend Development

```bash
cd backend
go run main.go          # Run server
go mod tidy             # Update dependencies
go fmt                  # Format code
go vet                  # Check for issues
```

### Frontend Development

```bash
cd frontend
npm run dev             # Development server
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## 🌟 Key Features Demonstrated

1. **Server-Side Rendering**: Go backend serves fully rendered HTML with embedded data
2. **Blog Management**: Complete CRUD operations for blog posts
3. **SEO Optimization**: Meta tags, canonical URLs, Open Graph, and XML sitemaps
4. **SEO-Friendly URLs**: Human-readable slugs instead of IDs
5. **Markdown Support**: Rich text editing with live preview
6. **File-based Storage**: No database required, content stored as files
7. **Type Safety**: Auto-generated TypeScript types from Go backend
8. **Responsive Design**: Works perfectly on all devices
9. **Hot Reloading**: Development mode with instant frontend updates
10. **Web-based Editing**: All content management through the frontend
11. **Low Cost Deployment**: Optimized for Railway without database costs

## 📚 Learning Resources

### Go

- [Go Official Tutorial](https://tour.golang.org/)
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://golang.org/doc/effective_go.html)

### React + TypeScript

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is an open-source learning project! Feel free to:

- Add new blog features (comments, categories, tags)
- Improve the markdown editor
- Implement testing
- Optimize performance
- Add authentication
- Improve SEO features
- Add database support as an option

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy coding! 🎉**

Built with ❤️ using Go and React

_This project serves as both a practical blog platform and a comprehensive learning resource for Go development. Perfect for developers looking to build lightweight, cost-effective blogs without database dependencies._
