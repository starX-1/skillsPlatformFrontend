import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      new URL("https://images.unsplash.com/**")
    ]
  }
  /* config options here */
};

export default nextConfig;
