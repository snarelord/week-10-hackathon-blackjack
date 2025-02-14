/** @type {import('next').NextConfig} */

let userConfig;
try {
  userConfig = require("./v0-user-next.config");
} catch (e) {
  // ignore error
  userConfig = {};
}

const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  ...userConfig,
};

module.exports = nextConfig;
