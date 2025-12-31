import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent 307 redirects for API routes (important for Stripe webhooks)
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
