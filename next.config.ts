import type { NextConfig } from "next";

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: storageBucket ? `/${storageBucket}/**` : "/**",
      },
    ],
  },
};

export default nextConfig;
