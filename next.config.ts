import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lqtsuvkbracmxgjlmhkd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/uploaded_images/**',
      },
    ],
  },
};

export default nextConfig;
