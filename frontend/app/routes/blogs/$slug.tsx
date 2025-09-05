import { Link, useLoaderData } from "react-router";
import { getBlogBySlug } from "@/lib/api";
import type { LoaderFunctionArgs } from "react-router";
import { generateBlogMetadata } from "@/lib/metadata";
import MarkdownContent from "@/components/MarkdownContent";
import { ArrowLeft, User, Calendar, Edit, FileText } from "lucide-react";

import Layout from "@/components/layout/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    return { blog: null, error: "Blog slug is required", notFound: true };
  }

  try {
    const blog = await getBlogBySlug(slug);
    return { blog, error: null, notFound: false };
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return { blog: null, error: "Blog not found", notFound: true };
  }
}

const meta = ({ data }: { data?: { blog: any; notFound: boolean } }) => {
  if (!data) {
    // During initial render, return basic meta tags
    return [
      { title: "Loading..." },
      { name: "description", content: "Loading blog post..." },
    ];
  }
  return generateBlogMetadata(data.blog, data.notFound).meta;
};

export { meta };

// Note: We don't define a links function for dynamic routes
// because we can't generate canonical URLs without the blog data
// The canonical URL is handled in the meta function via og:url

const RouteErrorBoundary = () => {
  return (
    <ErrorBoundary
      title="Something went wrong"
      message="We couldn't load the blog post you requested."
      actionText="Back to Blog"
      actionHref="/"
    />
  );
};

export { RouteErrorBoundary as ErrorBoundary };

const BlogPost = () => {
  const { blog, notFound } = useLoaderData<typeof loader>();

  if (notFound || !blog) {
    return (
      <Layout
        title="Blog Not Found"
        className="flex flex-col items-center justify-center py-36"
      >
        <div className="mb-6">
          <FileText className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Blog Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The blog post you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Blog
        </Link>
      </Layout>
    );
  }

  return (
    <Layout title={blog.title}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center">
            {/* Blog Title */}
            <div className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </div>

            <div className="flex space-x-4">
              <Link
                to={`/blogs/${blog.slug}/edit`}
                className="inline-flex items-center p-2 bg-yellow-500 text-white font-medium rounded-full hover:bg-yellow-600 transition-colors"
                aria-label={`Edit blog post: ${blog.title}`}
              >
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Blog Meta Information */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                By: <User className="w-4 h-4 mr-1" />
                <span className="font-medium text-gray-700">
                  {blog.author_name}
                </span>
                {blog.author_username && (
                  <span className="text-gray-500 ml-2">
                    (@{blog.author_username})
                  </span>
                )}
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(blog.created).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Last Updated */}
            {blog.updated !== blog.created && (
              <div className="text-xs text-gray-400">
                Last updated: {new Date(blog.updated).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Blog Content */}
          <MarkdownContent content={blog.content} />
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
