/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images served from the existing site + Firebase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "www.reversosolutions.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
};
export default nextConfig;
