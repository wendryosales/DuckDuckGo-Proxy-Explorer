import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl && process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_API_URL must be set in production environment"
      );
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl || "http://localhost:3002"}/:path*`,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.module.rules.push({
        test: /\.test\.(js|jsx|ts|tsx)$/,
        loader: "ignore-loader",
      });
    }
    return config;
  },
};

export default nextConfig;
