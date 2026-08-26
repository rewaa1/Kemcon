import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const csp = [
  "default-src 'self'",
  // Next.js inline scripts + Vercel Speed Insights
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Tailwind + Framer Motion inline styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Local images, Cloudinary responses, AI-generated images
  "img-src 'self' data: blob: https://res.cloudinary.com https://gen.pollinations.ai https://utfs.io https://2e3n0iobhs.ufs.sh",
  // Google Fonts files
  "font-src 'self' https://fonts.gstatic.com",
  // API calls: Cloudinary upload, Pollinations, GlitchTip/Sentry
  "connect-src 'self' https://api.cloudinary.com https://gen.pollinations.ai https://utfs.io https://2e3n0iobhs.ufs.sh https://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.glitchtip.com",
  // No iframes
  "frame-ancestors 'none'",
  // No plugins
  "object-src 'none'",
  // Upgrade insecure requests in production
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "gen.pollinations.ai" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Pinned to our UploadThing app rather than *.ufs.sh — /_next/image is
      // outside the middleware matcher, so a wildcard is an open image proxy.
      { protocol: "https", hostname: "2e3n0iobhs.ufs.sh", pathname: "/f/**" },
      { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "kemcon",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
