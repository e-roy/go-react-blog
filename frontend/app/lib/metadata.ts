import type { Blog } from "@/types";
import { SITE_CONFIG } from "./config";

// Base metadata interface
export interface BaseMetadata {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  ogSiteName?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTag?: string[];
}

// Blog-specific metadata interface
export interface BlogMetadata extends BaseMetadata {
  blog: Blog;
  isNotFound?: boolean;
}

// Return type for both meta and links
export interface MetaAndLinks {
  meta: Array<{ [key: string]: string }>;
  links: Array<{ [key: string]: string }>;
}

/**
 * Generate comprehensive metadata for any page
 */
const generateMetadata = (metadata: BaseMetadata): MetaAndLinks => {
  const meta: Array<{ [key: string]: string }> = [];
  const links: Array<{ [key: string]: string }> = [];

  // Basic SEO
  meta.push({ title: metadata.title });
  meta.push({ name: "description", content: metadata.description });

  if (metadata.keywords) {
    meta.push({ name: "keywords", content: metadata.keywords });
  }

  if (metadata.author) {
    meta.push({ name: "author", content: metadata.author });
  }

  // Canonical URL - This goes in links, not meta
  if (metadata.canonical) {
    links.push({ rel: "canonical", href: metadata.canonical });
  }

  // Robots
  meta.push({ name: "robots", content: metadata.robots || "index, follow" });

  // Open Graph
  meta.push({ property: "og:title", content: metadata.title });
  meta.push({ property: "og:description", content: metadata.description });
  meta.push({ property: "og:type", content: metadata.ogType || "website" });
  meta.push({
    property: "og:site_name",
    content: metadata.ogSiteName || SITE_CONFIG.name,
  });
  meta.push({
    property: "og:url",
    content: metadata.canonical || SITE_CONFIG.url,
  });

  if (metadata.ogImage) {
    meta.push({ property: "og:image", content: metadata.ogImage });
    if (metadata.ogImageAlt) {
      meta.push({ property: "og:image:alt", content: metadata.ogImageAlt });
    }
  }

  // Twitter Card
  meta.push({
    name: "twitter:card",
    content: metadata.twitterCard || "summary_large_image",
  });
  meta.push({ name: "twitter:title", content: metadata.title });
  meta.push({ name: "twitter:description", content: metadata.description });

  if (metadata.twitterSite) {
    meta.push({ name: "twitter:site", content: metadata.twitterSite });
  }

  if (metadata.twitterCreator) {
    meta.push({ name: "twitter:creator", content: metadata.twitterCreator });
  }

  // Article-specific metadata
  if (metadata.articlePublishedTime) {
    meta.push({
      property: "article:published_time",
      content: metadata.articlePublishedTime,
    });
  }

  if (metadata.articleModifiedTime) {
    meta.push({
      property: "article:modified_time",
      content: metadata.articleModifiedTime,
    });
  }

  if (metadata.articleAuthor) {
    meta.push({ property: "article:author", content: metadata.articleAuthor });
  }

  if (metadata.articleSection) {
    meta.push({
      property: "article:section",
      content: metadata.articleSection,
    });
  }

  if (metadata.articleTag && metadata.articleTag.length > 0) {
    metadata.articleTag.forEach((tag) => {
      meta.push({ property: "article:tag", content: tag });
    });
  }

  return { meta, links };
};

/**
 * Generate metadata for blog posts
 */
const generateBlogMetadata = (
  blog: Blog | null,
  isNotFound = false
): MetaAndLinks => {
  if (isNotFound || !blog) {
    return generateMetadata({
      title: "Blog Not Found",
      description: "The blog post you're looking for doesn't exist.",
      robots: "noindex, nofollow",
      canonical: `${SITE_CONFIG.url}/blogs/not-found`,
    });
  }

  const canonicalUrl = `${SITE_CONFIG.url}/blogs/${blog.slug}`;

  return generateMetadata({
    title: blog.meta_name || blog.title,
    description: blog.meta_description,
    author: blog.author_name,
    canonical: canonicalUrl,
    ogType: "article",
    ogSiteName: SITE_CONFIG.name,
    ogImage: SITE_CONFIG.defaultImage,
    ogImageAlt: blog.meta_name || blog.title,
    twitterCard: "summary_large_image",
    twitterSite: SITE_CONFIG.twitterHandle,
    twitterCreator: blog.author_username
      ? `@${blog.author_username}`
      : undefined,
    articlePublishedTime: blog.created,
    articleModifiedTime: blog.updated,
    articleAuthor: blog.author_name,
    articleSection: "Technology",
    articleTag: ["blog", "technology", "development"],
  });
};

/**
 * Generate metadata for the home page
 */
const generateHomeMetadata = (): MetaAndLinks => {
  return generateMetadata({
    title: `${SITE_CONFIG.name} - Home`,
    description: SITE_CONFIG.description,
    canonical: SITE_CONFIG.url,
    ogType: "website",
    ogSiteName: SITE_CONFIG.name,
    ogImage: SITE_CONFIG.defaultImage,
    twitterCard: "summary_large_image",
    twitterSite: SITE_CONFIG.twitterHandle,
    twitterCreator: SITE_CONFIG.twitterHandle,
  });
};

/**
 * Generate metadata for error pages
 */
const generateErrorMetadata = (
  errorType: "404" | "500" | "error" = "error"
): MetaAndLinks => {
  const errorConfig = {
    "404": {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist.",
    },
    "500": {
      title: "Server Error",
      description: "Something went wrong on our end. Please try again later.",
    },
    error: {
      title: "Error",
      description: "An error occurred. Please try again.",
    },
  };

  const config = errorConfig[errorType];

  return generateMetadata({
    title: config.title,
    description: config.description,
    robots: "noindex, nofollow",
    canonical: `${SITE_CONFIG.url}/${errorType}`,
  });
};

/**
 * Generate metadata for the blog creation page
 */
const generateBlogCreateMetadata = (): MetaAndLinks => {
  return generateMetadata({
    title: `Create New Blog Post - ${SITE_CONFIG.name}`,
    description: "Create a new blog post with markdown support.",
    canonical: `${SITE_CONFIG.url}/blogs/new`,
    ogType: "website",
    ogSiteName: SITE_CONFIG.name,
    robots: "noindex, nofollow",
  });
};

/**
 * Generate metadata for the blog edit page
 */
const generateBlogEditMetadata = (): MetaAndLinks => {
  return generateMetadata({
    title: `Edit Blog Post - ${SITE_CONFIG.name}`,
    description: "Edit an existing blog post.",
    canonical: `${SITE_CONFIG.url}/blogs/edit`,
    ogType: "website",
    ogSiteName: SITE_CONFIG.name,
    robots: "noindex, nofollow",
  });
};

// Legacy functions for backward compatibility (return only meta tags)
const generateBlogMetadataMeta = (
  blog: Blog | null,
  isNotFound = false
): Array<{ [key: string]: string }> => {
  return generateBlogMetadata(blog, isNotFound).meta;
};

const generateHomeMetadataMeta = (): Array<{ [key: string]: string }> => {
  return generateHomeMetadata().meta;
};

const generateErrorMetadataMeta = (
  errorType: "404" | "500" | "error" = "error"
): Array<{ [key: string]: string }> => {
  return generateErrorMetadata(errorType).meta;
};

export {
  generateMetadata,
  generateBlogMetadata,
  generateHomeMetadata,
  generateErrorMetadata,
  generateBlogCreateMetadata,
  generateBlogEditMetadata,
  generateBlogMetadataMeta,
  generateHomeMetadataMeta,
  generateErrorMetadataMeta,
};
