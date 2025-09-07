import { lazy } from "react";

// Lazy load page components based on route
export const LazyHome = lazy(() => import("./Home"));
export const LazyBlogPost = lazy(() => import("./BlogPost"));
export const LazyNewBlogPage = lazy(() => import("./NewBlogPage"));
export const LazyEditBlogPage = lazy(() => import("./EditBlogPage"));
export const LazySitemapPage = lazy(() => import("./SitemapPage"));
export const LazyNotFound = lazy(() => import("./NotFound"));
