import { Blog } from "@/types/generated";
import { Image, Calendar, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

const BlogCard = ({ blog }: { blog: Blog }) => {
  // Create a custom component to render plain text from markdown
  const PlainTextRenderer = ({ children, ...props }: any) => {
    return <span {...props}>{children}</span>;
  };

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="border-b border-gray-300 pb-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Section */}
        <div className="w-full lg:w-2/5 h-48 lg:h-48 bg-gray-200 flex-shrink-0">
          {/* {blog.image_url ? (
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : ( */}
          <div className="w-full h-full bg-gradient-to-br from-sky-200 to-blue-100 flex items-center justify-center">
            <Image className="w-12 h-12 text-blue-400" />
          </div>
          {/* )} */}
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-3/5 flex flex-col justify-between">
          <div>
            {/* Title and Date Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <h2 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
                {blog.title}
              </h2>
              <div className="flex items-center text-gray-500 text-sm whitespace-nowrap">
                <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>{formatDate(blog.created)}</span>
              </div>
            </div>

            {/* Content Excerpt */}
            <div className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
              <ReactMarkdown
                components={{
                  // Render all elements as plain text
                  h1: PlainTextRenderer,
                  h2: PlainTextRenderer,
                  h3: PlainTextRenderer,
                  h4: PlainTextRenderer,
                  h5: PlainTextRenderer,
                  h6: PlainTextRenderer,
                  p: PlainTextRenderer,
                  strong: PlainTextRenderer,
                  em: PlainTextRenderer,
                  code: PlainTextRenderer,
                  pre: PlainTextRenderer,
                  a: PlainTextRenderer,
                  img: () => null,
                  blockquote: PlainTextRenderer,
                  ul: PlainTextRenderer,
                  ol: PlainTextRenderer,
                  li: PlainTextRenderer,
                }}
              >
                {blog.content.length > 280
                  ? blog.content.substring(0, 280) + "..."
                  : blog.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Read More Button */}
          <div className="mt-auto">
            <a
              href={`/blogs/${blog.slug}`}
              className="inline-flex items-center hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium gap-2 border border-gray-200 transition-colors duration-200"
              aria-label={`Read more about ${blog.title}`}
            >
              Read more about {blog.title} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
