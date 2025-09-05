import { apiClient } from "../client";
import type { ApiResponse, Blog, CreateBlogRequest } from "@/types";
import { extractData, extractDataArray } from "../utils";

// Fetch all blogs
export const fetchBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Blog[]>>("/blogs");
    return extractDataArray(response);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
};

// Get a single blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  try {
    const response = await apiClient.get<ApiResponse<Blog>>(`/blogs/${slug}`);
    return extractData(response);
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    throw new Error("Failed to fetch blog");
  }
};

// Create a new blog
export const createBlog = async (
  blogData: CreateBlogRequest
): Promise<Blog> => {
  try {
    const response = await apiClient.post<ApiResponse<Blog>>(
      "/blogs",
      blogData
    );
    return extractData(response);
  } catch (error) {
    console.error("Failed to create blog:", error);
    throw new Error("Failed to create blog");
  }
};

// Update an existing blog
export const updateBlog = async (
  slug: string,
  blogData: Partial<CreateBlogRequest>
): Promise<Blog> => {
  try {
    const response = await apiClient.put<ApiResponse<Blog>>(
      `/blogs/${slug}`,
      blogData
    );
    return extractData(response);
  } catch (error) {
    console.error("Failed to update blog:", error);
    throw new Error("Failed to update blog");
  }
};

// Delete a blog
export const deleteBlog = async (slug: string): Promise<void> => {
  try {
    await apiClient.delete(`/blogs/${slug}`);
  } catch (error) {
    console.error("Failed to delete blog:", error);
    throw new Error("Failed to delete blog");
  }
};
