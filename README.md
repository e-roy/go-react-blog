# Go + React Blog Platform

A lightweight, full-stack blog platform built with **Go** for the backend and **React + TypeScript + Vite + Tailwind CSS** for the frontend. This project serves as both a practical blog solution and a learning journey for Go development.

## 🚀 Features

- **Backend**: Go HTTP server with file-based storage (no database required)
- **Frontend**: Modern React application with TypeScript
- **Blog Management**: Create, edit, and delete blog posts through web interface
- **SEO-Friendly**: Human-readable URLs using slugs
- **Markdown Support**: Rich text editing with live preview
- **Type Safety**: Auto-generated TypeScript types from Go backend
- **File Storage**: Markdown content with JSON metadata
- **Responsive Design**: Works on desktop, tablet, and mobile
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
│   │   ├── routes/         # Page components
│   │   ├── lib/            # API client and utilities
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # React entry point
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend

- **Go 1.21+** - Programming language
- **Gorilla Mux** - HTTP router and URL matcher
- **File-based Storage** - Markdown + JSON metadata (no database)
- **UUID** - Unique identifiers for blog posts
- **CORS** - Cross-origin resource sharing support
- **Type Generation** - Automatic TypeScript type generation

### Frontend

- **React 19** - Modern React with hooks and patterns
- **TypeScript** - Type safety with auto-generated types
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 🚀 Quick Start

### Prerequisites

- **Go 1.21+** - [Download here](https://golang.org/dl/)
- **Node.js 18+** - [Download here](https://nodejs.org/)

### 1. Start the Go Backend

```bash
cd backend
go mod tidy          # Download dependencies
go run main.go       # Start the server
```

The backend will start on **http://localhost:8080**

### 2. Start the React Frontend

```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
```

The frontend will start on **http://localhost:5173**

### 3. Open Your Browser

Navigate to **http://localhost:5173** to see the application in action!

## 📡 API Endpoints

The Go backend provides these REST endpoints:

- `GET /api/health` - Health check
- `GET /api/blogs` - Get all blog posts
- `POST /api/blogs` - Create a new blog post
- `GET /api/blogs/{slug}` - Get blog post by slug
- `PUT /api/blogs/{slug}` - Update blog post by slug
- `DELETE /api/blogs/{slug}` - Delete blog post by slug

## 🎯 What You'll Learn

### Go Backend

- HTTP server setup with Go
- File-based storage (no database required)
- RESTful API design with slug-based routing
- JSON handling and structs
- Interface-based architecture
- Error handling patterns
- Concurrency with goroutines and mutexes
- Type generation for frontend integration
- Middleware (CORS, logging)

### React Frontend

- Modern React 19 with hooks
- TypeScript integration with auto-generated types
- API communication with Axios
- Markdown editing and preview
- Form handling and validation
- Responsive UI design with Tailwind CSS
- State management and routing
- Component composition and reusability

### Full-Stack Integration

- Type-safe API communication
- Automatic type synchronization
- SEO-friendly URL structure
- File-based content management
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

1. **Blog Management**: Complete CRUD operations for blog posts
2. **SEO-Friendly URLs**: Human-readable slugs instead of IDs
3. **Markdown Support**: Rich text editing with live preview
4. **File-based Storage**: No database required, content stored as files
5. **Type Safety**: Auto-generated TypeScript types from Go backend
6. **Responsive Design**: Works perfectly on all devices
7. **Web-based Editing**: All content management through the frontend
8. **Low Cost Deployment**: Optimized for Railway without database costs

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
