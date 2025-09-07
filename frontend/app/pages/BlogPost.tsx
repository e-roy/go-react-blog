import { getEmbeddedSingleBlogData } from "@/lib/embedded-data";
import MarkdownContent from "@/components/MarkdownContent";
import { ArrowLeft, User, Calendar, Edit, FileText } from "lucide-react";
import type { Blog } from "@/types/generated";
import Layout from "@/components/layout/Layout";

const BlogPost = () => {
  // Get embedded data directly from server-side rendering
  const embeddedData = getEmbeddedSingleBlogData();

  // If no embedded data, show not found
  if (!embeddedData) {
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
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Blog
        </a>
      </Layout>
    );
  }

  const blog = embeddedData as Blog;

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
              <a
                href={`/blogs/${blog.slug}/edit`}
                className="inline-flex items-center p-2 bg-yellow-500 text-white font-medium rounded-full hover:bg-yellow-600 transition-colors"
                aria-label={`Edit blog post: ${blog.title}`}
              >
                <Edit className="w-4 h-4" />
              </a>
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
              <div className="text-xs text-gray-500">
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
