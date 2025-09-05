// import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    babel({
      babelConfig: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
