import { generateSitemap } from "@/lib/sitemap";

const SitemapPage = () => {
  try {
    const baseUrl = window.location.origin;
    const sitemapXml = generateSitemap(baseUrl);

    return (
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
        {sitemapXml}
      </pre>
    );
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Sitemap Error</h1>
        <p className="text-gray-600">Failed to generate sitemap</p>
      </div>
    );
  }
};

export default SitemapPage;
