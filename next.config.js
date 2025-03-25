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
  // Add Sentry config here
  sentry: {
    // This enables Sentry's webpack plugin
    // Set to 'true' to enable Sentry integration
    // or 'false' to disable
    webpack: {
      sentry: true,
    },
  },
};

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  org: "school-of-code-73",
  project: "blackjack",
  sentryBuildOptions: {
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
      disable: false,
    },
    widenClientFileUpload: true,
    reactComponentAnnotation: {
      enabled: true,
    },
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
});
