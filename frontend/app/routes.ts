import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("blogs/new", "routes/blogs/new.tsx"),
  route("blogs/:slug/edit", "routes/blogs/$slug.edit.tsx"),
  route("blogs/:slug", "routes/blogs/$slug.tsx"),
  route("sitemap.xml", "routes/sitemap.xml.tsx"),
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
