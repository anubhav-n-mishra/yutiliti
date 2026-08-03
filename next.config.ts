import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 4,
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
