import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["three", "framer-motion"],
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "yuitility.app",
          },
        ],
        destination: "https://www.yuitility.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
