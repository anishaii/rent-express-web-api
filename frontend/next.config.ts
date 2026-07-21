import type { NextConfig } from "next";

const backendURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
const isDev = backendURL.startsWith("http://localhost");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // allow next/image to load images from our own backend on localhost during dev
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "rent-express-web-api.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
