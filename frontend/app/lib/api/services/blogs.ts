import { apiClient } from "../client";
import type { ApiResponse, Blog, CreateBlogRequest } from "@/types";
import { extractData } from "../utils";

// Note: Read operations (fetchBlogs, getBlogBySlug) are no longer needed
// as data is embedded directly in the HTML via server-side rendering

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
