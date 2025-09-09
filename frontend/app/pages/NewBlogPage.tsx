import BlogForm from "@/components/BlogForm";
import type { CreateBlogRequest } from "@/types/generated";
import { createBlog } from "@/lib/api/services/blogs";

const NewBlogPage = () => {
  const handleCreateBlog = async (
    blogData: CreateBlogRequest,
    selectedImage?: File | null
  ) => {
    try {
      const newBlog = await createBlog(blogData, selectedImage);

      // Navigate to the new blog post
      window.location.href = `/blogs/${newBlog.slug}`;
    } catch (err) {
      console.error("Failed to create blog:", err);
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  return (
    <BlogForm
      onSubmit={handleCreateBlog}
      onCancel={handleCancel}
      isEditing={false}
    />
  );
};

export default NewBlogPage;
