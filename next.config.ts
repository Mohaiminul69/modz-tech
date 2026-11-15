import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Google profile pictures (Better Auth Google sign-in)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  partialPrefetching: true,
  // Old footer addresses: now the delivery page and a section of the policy page.
  redirects: async () => [
    { source: "/delivery-policy", destination: "/delivery", permanent: true },
    { source: "/return-policy", destination: "/policy#returns", permanent: true },
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
