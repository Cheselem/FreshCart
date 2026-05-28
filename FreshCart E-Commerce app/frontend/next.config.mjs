/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },     // Unsplash+ premium photos
      { protocol: "https", hostname: "cdn.freshcart.app" },
    ],
  },
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return [
      // proxy API in dev so JWT cookies stay first-party
      { source: "/api/v1/:path*", destination: `${api}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
