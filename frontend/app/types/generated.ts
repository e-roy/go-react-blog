// Auto-generated TypeScript types from Go backend
// Generated on: 2025-08-31
// Do not edit manually - regenerate with: go run tools/generate-types.go


// Blog represents a blog post in the system
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


// CreateBlogRequest represents the data needed to create a blog
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


// UpdateBlogRequest represents the data needed to update a blog
export interface UpdateBlogRequest {
  title: string | null;
  content: string | null;
  meta_name: string | null;
  meta_description: string | null;
  slug: string | null;
  published: boolean | null;
}


// BlogResponse represents the blog data sent to clients
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


// Response represents a generic API response
export interface Response {
  message: string;
  timestamp: string;
  data: any;
  error: string;
}


