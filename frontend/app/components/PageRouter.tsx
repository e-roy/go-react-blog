import { Suspense } from "react";
import {
  LazyHome,
  LazyBlogPost,
  LazyNewBlogPage,
  LazyEditBlogPage,
  LazySitemapPage,
  LazyNotFound,
} from "../pages/LazyPages";

// Minimal loading component for suspense fallback
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

// Get page type from embedded data
const getPageType = (): string => {
  return (window as any).__PAGE_TYPE__ || "home";
};

// Main page router component
const PageRouter = () => {
  const pageType = getPageType();

  const renderPage = () => {
    switch (pageType) {
      case "home":
        return <LazyHome />;
      case "blog":
        return <LazyBlogPost />;
      case "new":
        return <LazyNewBlogPage />;
      case "edit":
        return <LazyEditBlogPage />;
      case "sitemap":
        return <LazySitemapPage />;
      default:
        return <LazyNotFound />;
    }
  };

  return <Suspense fallback={<PageLoading />}>{renderPage()}</Suspense>;
};

export default PageRouter;
