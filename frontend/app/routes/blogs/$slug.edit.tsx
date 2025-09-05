import { useNavigate, useLoaderData } from "react-router";
import { getBlogBySlug, updateBlog, deleteBlog } from "@/lib/api";
import BlogForm from "@/components/BlogForm";
import { generateBlogEditMetadata } from "@/lib/metadata";
import type { LoaderFunctionArgs } from "react-router";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { CreateBlogRequest } from "@/types/generated";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Error("Blog slug is required");
  }

  try {
    const blog = await getBlogBySlug(slug);
    return { blog, error: null };
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    throw new Error("Blog not found");
  }
}

const meta = () => {
  return generateBlogEditMetadata().meta;
};

const links = () => {
  return generateBlogEditMetadata().links;
};

const RouteErrorBoundary = () => {
  return (
    <ErrorBoundary
      title="Blog Not Found"
      message="The blog post you're trying to edit doesn't exist."
      actionText="Back to Home"
      actionHref="/"
    />
  );
};

export { meta, links };
export { RouteErrorBoundary as ErrorBoundary };

const EditBlogPage = () => {
  const navigate = useNavigate();
  const { blog } = useLoaderData<typeof loader>();

  const handleUpdateBlog = async (blogData: CreateBlogRequest) => {
    try {
      // Convert form data to update request
      const updateRequest = {
        title: blogData.title,
        content: blogData.content,
        meta_name: blogData.meta_name,
        meta_description: blogData.meta_description,
        slug: blogData.slug,
        published: blogData.published,
      };

      const updatedBlog = await updateBlog(blog.slug, updateRequest);
      console.log("Blog updated successfully:", updatedBlog);

      // Navigate back to the blog post (use new slug if it changed)
      navigate(`/blogs/${updatedBlog.slug}`);
    } catch (err) {
      console.error("Failed to update blog:", err);
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleCancel = () => {
    navigate(`/blogs/${blog.slug}`);
  };

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(blog.slug);
      // Navigate to home page after successful deletion
      navigate("/");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  // Convert blog data to form data
  const initialFormData: CreateBlogRequest = {
    title: blog.title,
    content: blog.content,
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
