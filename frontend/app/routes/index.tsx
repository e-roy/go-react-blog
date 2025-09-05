import { useLoaderData } from "react-router";
import { fetchBlogs } from "@/lib/api";
import type { LoaderFunctionArgs } from "react-router";
import { generateHomeMetadata } from "@/lib/metadata";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/BlogCard";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function loader({}: LoaderFunctionArgs) {
  try {
    const blogs = await fetchBlogs();
    return { blogs, error: null };
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return { blogs: [], error: "Failed to fetch blogs" };
  }
}

const meta = () => {
  return generateHomeMetadata().meta;
};

const links = () => {
  return generateHomeMetadata().links;
};

const RouteErrorBoundary = () => {
  return (
    <ErrorBoundary
      title="Something went wrong"
      message="We couldn't load the blog list. Please try again later."
      actionText="Retry"
      onActionClick={() => window.location.reload()}
    />
  );
};

export { meta, links };
export { RouteErrorBoundary as ErrorBoundary };

const Home = () => {
  const { blogs, error } = useLoaderData<typeof loader>();
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-12">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
