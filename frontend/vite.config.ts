import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths(),
    babel({
      babelConfig: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Enable minification and compression
    minify: "esbuild",
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into one chunk
          vendor: ["react", "react-dom", "axios", "lucide-react"],

          // Split page components
          "home-page": ["./src/../app/pages/Home.tsx"],
          "blog-page": ["./src/../app/pages/BlogPost.tsx"],
          "edit-page": ["./src/../app/pages/EditBlogPage.tsx"],
          "new-page": ["./src/../app/pages/NewBlogPage.tsx"],

          // Shared components chunk (used by edit and new pages)
          "blog-form": ["./src/../app/components/BlogForm"],
        },
        // Optimize asset names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || ["asset"];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
