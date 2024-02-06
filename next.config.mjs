/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
    api: {
      responseLimit: false,
      bodyParser: {
        sizeLimit: '1000mb',
      },
    },
  },
};

export default nextConfig;
