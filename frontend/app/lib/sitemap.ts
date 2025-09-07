import { getEmbeddedBlogData } from "./embedded-data";

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export function generateSitemap(baseUrl: string): string {
  try {
    const blogs = getEmbeddedBlogData();
    const currentDate = new Date().toISOString().split("T")[0];

    const urls: SitemapUrl[] = [
      {
        loc: `${baseUrl}/`,
        lastmod: currentDate,
        changefreq: "daily",
        priority: 1.0,
      },
    ];

    // Add individual blog posts if data is available
    if (blogs && Array.isArray(blogs)) {
      blogs.forEach((blog: any) => {
        urls.push({
          loc: `${baseUrl}/blogs/${blog.slug}`,
          lastmod: new Date(blog.created).toISOString().split("T")[0],
          changefreq: "monthly",
          priority: 0.8,
        });
      });
    }

    return generateSitemapXml(urls);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return a basic sitemap with just the main pages
    return generateBasicSitemap(baseUrl);
  }
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const xmlUrls = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlUrls}
</urlset>`;
}

function generateBasicSitemap(baseUrl: string): string {
  const currentDate = new Date().toISOString().split("T")[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}
