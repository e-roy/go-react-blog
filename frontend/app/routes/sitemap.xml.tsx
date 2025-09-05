import { generateSitemap } from "@/lib/sitemap";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const sitemapXml = await generateSitemap(baseUrl);

    return { sitemapXml, baseUrl };
  } catch (error) {
    console.error("Error in sitemap loader:", error);
    return { error: "Failed to generate sitemap", baseUrl: "" };
  }
}

const SitemapRoute = () => {
  const { sitemapXml, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Sitemap Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
      {sitemapXml}
    </pre>
  );
};

export default SitemapRoute;
