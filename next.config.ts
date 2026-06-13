import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained server build for a small Cloud Run image.
  output: "standalone",
  // unpdf bundles pdf.js (uses import.meta); keep it external to the server bundle.
  serverExternalPackages: ["unpdf"],
};

export default nextConfig;
