/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["sharp"],
  experimental: {
    optimizePackageImports: ["qrcode"]
  }
};

export default nextConfig;
