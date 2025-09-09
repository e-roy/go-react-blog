import type { Blog, CreateBlogRequest } from "@/types";

// Note: Read operations (fetchBlogs, getBlogBySlug) are no longer needed
// as data is embedded directly in the HTML via server-side rendering

// Create a new blog (with optional image)
export const createBlog = async (
  blogData: CreateBlogRequest,
  imageFile?: File | null
): Promise<Blog> => {
  try {
    // Always send as FormData - backend always expects multipart/form-data
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("author_name", blogData.author_name);
    formData.append("author_username", blogData.author_username);
    formData.append("meta_name", blogData.meta_name);
    formData.append("meta_description", blogData.meta_description);
    formData.append("slug", blogData.slug);
    formData.append("published", blogData.published.toString());

    // Only append image if there is one
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/blogs", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create blog");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to create blog:", error);
    throw new Error("Failed to create blog");
  }
};

// Update an existing blog (with optional image)
export const updateBlog = async (
  slug: string,
  blogData: CreateBlogRequest,
  imageFile?: File | null
): Promise<Blog> => {
  try {
    // Always send as FormData - backend always expects multipart/form-data
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("author_name", blogData.author_name);
    formData.append("author_username", blogData.author_username);
    formData.append("meta_name", blogData.meta_name);
    formData.append("meta_description", blogData.meta_description);
    formData.append("slug", blogData.slug);
    formData.append("published", blogData.published.toString());

    // Only append image if there is one
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`/api/blogs/${slug}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update blog");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to update blog:", error);
    throw new Error("Failed to update blog");
  }
};

// Delete a blog
export const deleteBlog = async (slug: string): Promise<void> => {
  try {
    const response = await fetch(`/api/blogs/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete blog");
    }
  } catch (error) {
    console.error("Failed to delete blog:", error);
    throw new Error("Failed to delete blog");
  }
};
