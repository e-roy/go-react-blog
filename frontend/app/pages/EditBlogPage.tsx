import { getEmbeddedSingleBlogData } from "@/lib/embedded-data";
import BlogForm from "@/components/BlogForm";
import type { CreateBlogRequest, Blog } from "@/types/generated";
import { updateBlog, deleteBlog } from "@/lib/api/services/blogs";

const EditBlogPage = () => {
  // Get embedded data directly from server-side rendering
  const embeddedData = getEmbeddedSingleBlogData();

  // If no embedded data, show error
  if (!embeddedData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-red-600">
          Blog not found or no data available
        </div>
      </div>
    );
  }

  const blog = embeddedData as Blog;

  const handleUpdateBlog = async (
    blogData: CreateBlogRequest,
    selectedImage?: File | null
  ) => {
    try {
      const updatedBlog = await updateBlog(blog.slug, blogData, selectedImage);

      // Navigate back to the blog post (use new slug if it changed)
      window.location.href = `/blogs/${updatedBlog.slug}`;
    } catch (err) {
      console.error("Failed to update blog:", err);
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleCancel = () => {
    window.location.href = `/blogs/${blog.slug}`;
  };

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(blog.slug);

      // Navigate to home page after successful deletion
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  // Convert blog data to form data
  const initialFormData: CreateBlogRequest = {
    title: blog.title,
    content: blog.content,
    image: blog.image,
    author_name: blog.author_name,
    author_username: blog.author_username,
    published: blog.published,
    meta_name: blog.meta_name,
    meta_description: blog.meta_description,
    slug: blog.slug,
  };

  return (
    <BlogForm
      onSubmit={handleUpdateBlog}
      onCancel={handleCancel}
      initialData={initialFormData}
      isEditing={true}
      onDelete={handleDeleteBlog}
    />
  );
};

export default EditBlogPage;
