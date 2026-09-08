import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module - it has to stay out of the bundle.
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
