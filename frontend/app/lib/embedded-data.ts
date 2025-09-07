// Utility to get embedded data from the server-rendered page
export function getEmbeddedBlogData(): any[] | null {
  if (typeof window === "undefined") {
    return null; // Server-side rendering
  }

  const data = (window as any).__BLOG_DATA__;
  return data || null;
}

export function getEmbeddedSingleBlogData(): any | null {
  if (typeof window === "undefined") {
    return null; // Server-side rendering
  }

  const data = (window as any).__BLOG_DATA__;
  return data || null;
}
