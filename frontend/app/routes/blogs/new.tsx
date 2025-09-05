import { useNavigate } from "react-router";
import { createBlog } from "@/lib/api";
import BlogForm from "@/components/BlogForm";
import { generateBlogCreateMetadata } from "@/lib/metadata";
import type { CreateBlogRequest } from "@/types/generated";

const meta = () => {
  return generateBlogCreateMetadata().meta;
};

const links = () => {
  return generateBlogCreateMetadata().links;
};

export { meta, links };

const CreateBlogPage = () => {
  const navigate = useNavigate();

  const handleCreateBlog = async (blogData: CreateBlogRequest) => {
    try {
      const newBlog = await createBlog(blogData);

      navigate(`/blogs/${newBlog.slug}`);
    } catch (err) {
      console.error("Failed to create blog:", err);
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return <BlogForm onSubmit={handleCreateBlog} onCancel={handleCancel} />;
};

export default CreateBlogPage;
