import type { NextConfig } from "next";

/** Origins allowed to reach the dev server (sandbox/preview hosts, localhost). */
const devOrigins = ["localhost", "127.0.0.1", "*.e2b.app", "*.e2b.dev"];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
};

export default nextConfig;
