import BlogForm from "@/components/BlogForm";
import type { CreateBlogRequest } from "@/types/generated";

const NewBlogPage = () => {
  const handleCreateBlog = async (blogData: CreateBlogRequest) => {
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog");
      }

      const newBlog = await response.json();
      // console.log("Blog created successfully:", newBlog);

      // Navigate to the new blog post
      window.location.href = `/blogs/${newBlog.data.slug}`;
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
