import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Custom code block component with copy functionality
function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const codeContent = children?.toString() || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Check if this is a code block (not inline code)
  const isCodeBlock = className?.includes("language-");

  if (!isCodeBlock) {
    // Inline code - render normally
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // Code block - render with copy button
  return (
    <div className="relative group">
      <pre className={className} {...props}>
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 p-2 bg-gray-200 text-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

const MarkdownContent = ({
  content,
  className = "prose prose-lg max-w-none",
}: MarkdownContentProps) => {
  // Handle internal link navigation and smooth scrolling
  useEffect(() => {
    const handleInternalLinkClick = (event: Event) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element is a link
      if (target.tagName === "A") {
        const href = target.getAttribute("href");

        // Check if it's an internal link (starts with #)
        if (href && href.startsWith("#")) {
          event.preventDefault();

          // Remove the # to get the target ID
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Smooth scroll to the target element
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    };

    // Add event listener to the document
    document.addEventListener("click", handleInternalLinkClick);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleInternalLinkClick);
    };
  }, []);

  // Handle URL hash on component mount (for direct links to sections)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the content is rendered
      setTimeout(() => {
        const targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [content]);

  // Helper function to generate heading IDs
  const generateHeadingId = (children: React.ReactNode): string => {
    return (
      children
        ?.toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "") || ""
    );
  };

  // Custom heading components with auto-generated IDs
  const headingComponents = {
    h1: ({ children, ...props }: any) => {
      const id = generateHeadingId(children);
      return (
        <h1 id={id} {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: any) => {
      const id = generateHeadingId(children);
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const id = generateHeadingId(children);
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }: any) => {
      const id = generateHeadingId(children);
      return (
        <h4 id={id} {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }: any) => {
      const id = generateHeadingId(children);
      return (
        <h5 id={id} {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }: any) => {
      const id = generateHeadingId(children);
      return (
        <h6 id={id} {...props}>
          {children}
        </h6>
      );
    },
    // Custom code block component with copy functionality
    code: CodeBlock,
  };

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={headingComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
