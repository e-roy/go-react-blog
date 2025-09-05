# React Frontend - Blog Platform

This is a modern React application built with React Router v7, Vite, TypeScript, and Tailwind CSS that provides a full-featured blog platform with a Go backend.

## Features

- **React Router v7**: Latest routing with file-based routing and data loading
- **React 19**: Latest React with hooks and modern patterns
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Markdown Support**: Rich markdown editor with preview and syntax highlighting
- **SEO Optimized**: Dynamic meta tags, Open Graph, and Twitter Cards
- **Responsive Design**: Mobile-first design approach
- **Modern UI**: Clean, accessible interface with proper loading states
- **Internal Navigation**: Table of contents with smooth scrolling
- **Code Copy**: Copy-to-clipboard functionality for code blocks

## Project Structure

```
frontend/
├── app/                   # React Router v7 app directory
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
│   │   ├── metadata.ts    # SEO metadata generation
│   │   └── config.ts      # Application configuration
│   ├── routes/            # File-based routing
│   │   ├── index.tsx              # Home page (blog list)
│   │   ├── blogs/                 # Blog-related routes
│   │   │   ├── new.tsx            # Create new blog
│   │   │   ├── $slug.tsx          # View blog post
│   │   │   └── $slug.edit.tsx     # Edit blog post
│   │   └── root.tsx               # Root layout
│   ├── types/             # TypeScript type definitions
│   │   ├── api.ts                 # API response types
│   │   ├── blog.ts                # Blog-related types
│   │   ├── common.ts              # Common types
│   │   ├── generated.ts           # Auto-generated types from Go
│   │   └── index.ts               # Type exports
│   ├── app.css            # Global styles
│   └── root.tsx           # React Router root component
├── build/                 # Build output
├── dist/                  # Production build
├── package.json           # Dependencies and scripts
├── react-router.config.ts # React Router configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.ts         # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- You can download it from [nodejs.org](https://nodejs.org/)

### Running the Frontend

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

## API Integration

The frontend communicates with the Go backend at `http://localhost:8080/api`:

### Blog Operations

- **GET /blogs** - Fetch all blog posts
- **POST /blogs** - Create a new blog post
- **GET /blogs/{slug}** - Get a specific blog post by slug
- **PUT /blogs/{slug}** - Update a blog post
- **DELETE /blogs/{slug}** - Delete a blog post

### Health Check

- **GET /health** - Backend health status

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

### React Router v7

The project uses React Router v7 with:

- **File-based routing**: Routes defined by file structure
- **Data loading**: Built-in data loading with loaders
- **Error boundaries**: Automatic error handling
- **SEO optimization**: Dynamic meta tags and links

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
- **React Router**: 7.x (Latest)
- **TypeScript**: 5.5.3 (Latest)
- **Vite**: 5.4.10 (Latest)
- **Tailwind CSS**: 3.x (Latest)
- **Axios**: 1.7.2 (Latest)
- **React Markdown**: Latest with GitHub Flavored Markdown
- **Lucide React**: Latest icon library

## Features

### Current Features

- ✅ **Blog Management**: Create, read, update, delete blog posts
- ✅ **Markdown Editor**: Rich editor with toolbar and preview
- ✅ **SEO Optimization**: Dynamic meta tags and Open Graph
- ✅ **Responsive Design**: Mobile-first responsive layout
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
