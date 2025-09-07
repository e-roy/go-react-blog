import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/app.css";

// Import page components
import Home from "../app/pages/Home.tsx";
import BlogPost from "../app/pages/BlogPost.tsx";
import EditBlogPage from "../app/pages/EditBlogPage.tsx";
import NewBlogPage from "../app/pages/NewBlogPage.tsx";
import SitemapPage from "../app/pages/SitemapPage.tsx";
import NotFound from "../app/pages/NotFound.tsx";

// Get the page type from the server-rendered data
function getPageType(): string {
  if (typeof window === "undefined") {
    return "home"; // Server-side rendering
  }

  const pageType = (window as any).__PAGE_TYPE__;
  return pageType || "home";
}

// Render the appropriate page based on server data
function App() {
  const pageType = getPageType();

  switch (pageType) {
    case "blog":
      return <BlogPost />;
    case "edit":
      return <EditBlogPage />;
    case "new":
      return <NewBlogPage />;
    case "sitemap":
      return <SitemapPage />;
    case "notfound":
      return <NotFound />;
    case "home":
    default:
      return <Home />;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
