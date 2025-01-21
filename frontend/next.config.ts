import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb', // Set the limit to 10 MB or adjust as needed
    },
  },
};

module.exports = nextConfig;
