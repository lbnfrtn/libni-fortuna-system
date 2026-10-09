/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Order data is written to disk (local) or Firestore (prod); never statically cached.
  experimental: {},
  // Paid downloads (public/dl/<random>/) must never show up in search results.
  async headers() {
    return [{ source: "/dl/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // The Becoming lives at the cleaner /thementorship URL (2026-10-09).
  async redirects() {
    return [
      { source: "/programs/the-becoming", destination: "/thementorship", permanent: true },
      { source: "/the-mentorship", destination: "/thementorship", permanent: true },
      { source: "/thebecoming", destination: "/thementorship", permanent: true },
    ];
  },
};

export default nextConfig;
