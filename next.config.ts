import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allows production builds to successfully complete even if
    // your project has ESLint errors or warnings.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
