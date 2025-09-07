import { getEmbeddedBlogData } from "@/lib/embedded-data";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/BlogCard";
import type { Blog } from "@/types/generated";

const Home = () => {
  // Get embedded data directly from server-side rendering
  const embeddedData = getEmbeddedBlogData();

  // If no embedded data, show error (this should not happen with SSR)
  if (!embeddedData || !Array.isArray(embeddedData)) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-red-600">No blog data available</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-12">
        {embeddedData.map((blog: Blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
