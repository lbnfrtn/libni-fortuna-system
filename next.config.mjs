/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Order data is written to disk (local) or Firestore (prod); never statically cached.
  experimental: {},
};

export default nextConfig;
