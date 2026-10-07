/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Order data is written to disk (local) or Firestore (prod); never statically cached.
  experimental: {},
  // Paid downloads (public/dl/<random>/) must never show up in search results.
  async headers() {
    return [{ source: "/dl/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
