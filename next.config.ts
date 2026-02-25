import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are admin-managed and may come from any HTTPS domain.
    // Restricting to specific hostnames would break product image loading.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
