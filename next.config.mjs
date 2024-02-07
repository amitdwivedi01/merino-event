/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
    api: {
      responseLimit: '1000mb',
      bodyParser: {
        sizeLimit: '1000mb',
      },
    },
  },
};

export default nextConfig;
