import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
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
