// Site-wide configuration
export const SITE_CONFIG = {
  name: "Personal Blog",
  url: import.meta.env.VITE_SITE_URL || "http://localhost:3000",
  description:
    "Discover insights, tutorials, and stories about technology, development, and innovation.",
  twitterHandle: "@myblog",
  defaultImage:
    import.meta.env.VITE_DEFAULT_OG_IMAGE || "/images/default-og.jpg",
  author: "John Doe",
  keywords: "blog, technology, development, programming, tutorials",
  language: "en",
  timezone: "UTC",
} as const;
