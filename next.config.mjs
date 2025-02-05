/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io","img.clerk.com"], // Add the external image domain here
  },
};

export default nextConfig;
