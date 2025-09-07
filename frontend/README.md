# React Frontend - Blog Platform

This is a modern React application built with Vite, TypeScript, and Tailwind CSS that provides a full-featured blog platform with server-side rendering (SSR) from a Go backend.

## Features

- **Server-Side Rendering**: Embedded data from Go backend for instant loading
- **React 19**: Latest React with hooks and modern patterns
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Fast build tool and development server with hot reloading
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Markdown Support**: Rich markdown editor with preview and syntax highlighting
- **SEO Optimized**: Server-rendered meta tags, Open Graph, and Twitter Cards
- **Responsive Design**: Mobile-first design approach
- **Modern UI**: Clean, accessible interface with proper loading states
- **Internal Navigation**: Table of contents with smooth scrolling
- **Code Copy**: Copy-to-clipboard functionality for code blocks
- **Hot Reloading**: Development mode with instant frontend updates

## Project Structure

```
frontend/
├── app/                   # React application directory
│   ├── components/        # Reusable React components
│   │   ├── BlogCard.tsx          # Blog post preview card
│   │   ├── BlogForm.tsx          # Blog creation/editing form
│   │   ├── MarkdownEditor.tsx    # Rich markdown editor with toolbar
│   │   ├── MarkdownContent.tsx   # Markdown renderer with features
│   │   ├── Header.tsx            # Application header
│   │   ├── Footer.tsx            # Application footer
│   │   └── DeleteConfirmModal.tsx # Confirmation modal
│   ├── lib/               # Utility libraries
│   │   ├── api/           # API client and services
│   │   │   ├── client.ts         # Axios configuration
│   │   │   ├── utils.ts          # API utility functions
│   │   │   ├── services/         # API service functions
│   │   │   │   ├── blogs.ts      # Blog API operations
│   │   │   │   └── health.ts     # Health check API
│   │   │   └── index.ts          # API exports
│   │   ├── embedded-data.ts # Embedded data consumption
│   │   └── config.ts      # Application configuration
│   ├── pages/             # Page components (no client-side routing)
│   │   ├── Home.tsx              # Home page (blog list)
│   │   ├── BlogPost.tsx          # View blog post
│   │   ├── NewBlogPage.tsx       # Create new blog
│   │   ├── EditBlogPage.tsx      # Edit blog post
│   │   ├── SitemapPage.tsx       # Sitemap page
│   │   └── NotFound.tsx          # 404 page
│   ├── types/             # TypeScript type definitions
│   │   ├── api.ts                 # API response types
│   │   ├── blog.ts                # Blog-related types
│   │   ├── common.ts              # Common types
│   │   ├── generated.ts           # Auto-generated types from Go
│   │   └── index.ts               # Type exports
│   ├── app.css            # Global styles
│   └── main.tsx           # React entry point
├── dist/                  # Production build
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.ts         # Vite configuration with proxy
```

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- You can download it from [nodejs.org](https://nodejs.org/)

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

### Manual Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The frontend will start on http://localhost:5173

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This will serve the production build locally for testing.

## Key Components

### 1. **BlogCard.tsx**

Displays blog post previews with title, excerpt, author, and date. Includes navigation to full posts.

### 2. **BlogForm.tsx**

Rich form for creating and editing blog posts with:

- Markdown editor with toolbar
- SEO metadata fields
- Slug generation
- Form validation

### 3. **MarkdownEditor.tsx**

Advanced markdown editor featuring:

- Toolbar with formatting buttons
- Live preview mode
- Syntax highlighting
- Character count

### 4. **MarkdownContent.tsx**

Markdown renderer with enhanced features:

- Internal link navigation
- Copy-to-clipboard for code blocks
- Auto-generated heading IDs
- Smooth scrolling

### 5. **Header.tsx**

Application header with:

- Dynamic page titles
- Background images
- Responsive design

### 6. **Footer.tsx**

Application footer with:

- Social media links
- Site information
- Navigation links

### 7. **DeleteConfirmModal.tsx**

Confirmation modal for destructive actions with loading states.

## Architecture

The frontend now works with server-side rendering (SSR) from the Go backend:

### Server-Side Rendered Routes

- **GET /** - Home page with all blogs (SSR with embedded data)
- **GET /blogs/{slug}** - Individual blog post (SSR with embedded data)
- **GET /blogs/new** - New blog form
- **GET /blogs/{slug}/edit** - Edit blog form

### API Integration

The frontend communicates with the Go backend at `http://localhost:8080/api`:

### Blog Operations

- **POST /blogs** - Create a new blog post
- **PUT /blogs/{slug}** - Update a blog post
- **DELETE /blogs/{slug}** - Delete a blog post

### Health Check

- **GET /health** - Backend health status

### Embedded Data

- Blog data is embedded directly in HTML by the Go backend
- No client-side API calls needed for reading blog data
- Instant loading with `window.__BLOG_DATA__` and `window.__PAGE_TYPE__`

### Type Safety

- Auto-generated TypeScript types from Go structs
- Type-safe API calls with proper error handling
- Consistent response format across all endpoints

## Styling

The application uses Tailwind CSS with a modern, responsive design:

### Design System

- **Typography**: Inter font family with proper hierarchy
- **Colors**: Blue-based color scheme with gray accents
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Components**: Reusable component patterns with consistent styling

### Key Styling Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode Ready**: CSS variables for easy theme switching
- **Accessibility**: Proper contrast ratios and focus states
- **Modern UI**: Clean, minimal design with subtle shadows and borders

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

### Server-Side Rendering Integration

The project now uses server-side rendering with:

- **Embedded data**: Blog data injected directly into HTML
- **No client-side routing**: All routing handled by Go backend
- **Instant loading**: No API calls needed for initial page load
- **SEO optimization**: Server-rendered meta tags and links

### TypeScript

The project uses strict TypeScript configuration with:

- Strict mode enabled
- Unused variable/parameter checking
- Modern ES2022 target
- React JSX support
- Path mapping with `@/` alias

### Code Quality

- ESLint configuration for React and TypeScript
- Consistent `const` exports across all components
- Type-safe API calls with auto-generated types
- Proper error handling and loading states
- Component composition patterns

## Technology Versions

- **React**: 19.1.1 (Latest)
- **TypeScript**: 5.5.3 (Latest)
- **Vite**: 7.x (Latest)
- **Tailwind CSS**: 3.x (Latest)
- **Axios**: 1.7.2 (Latest)
- **React Markdown**: Latest with GitHub Flavored Markdown
- **Lucide React**: Latest icon library

## Features

### Current Features

- ✅ **Server-Side Rendering**: Embedded data from Go backend for instant loading
- ✅ **Blog Management**: Create, read, update, delete blog posts
- ✅ **Markdown Editor**: Rich editor with toolbar and preview
- ✅ **SEO Optimization**: Server-rendered meta tags and Open Graph
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Hot Reloading**: Development mode with instant frontend updates
- ✅ **Internal Navigation**: Table of contents with smooth scrolling
- ✅ **Code Copy**: Copy-to-clipboard for code blocks
- ✅ **Type Safety**: Auto-generated TypeScript types from Go
- ✅ **Error Handling**: Comprehensive error boundaries and states

### Planned Features

- 🔄 **User Authentication**: Login/logout and user management
- 🔄 **Comments System**: User comments on blog posts
- 🔄 **Search Functionality**: Full-text search across blog posts
- 🔄 **Categories & Tags**: Organize posts with categories and tags
- 🔄 **Draft System**: Save drafts before publishing
- 🔄 **Image Upload**: Upload and manage images for blog posts
- 🔄 **Analytics**: Track page views and user engagement
- 🔄 **Dark Mode**: Toggle between light and dark themes
- 🔄 **PWA Support**: Progressive Web App capabilities
- 🔄 **Testing**: Unit and integration test coverage
