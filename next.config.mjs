/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
    api: {
      responseLimit: false,
    },
  },
};

export default nextConfig;
