import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  ssr: true,
  // Build as static site for deployment
  buildDirectory: "dist",
} satisfies Config;
