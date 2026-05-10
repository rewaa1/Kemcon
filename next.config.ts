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
  "img-src 'self' data: blob: https://res.cloudinary.com https://image.pollinations.ai",
  // Google Fonts files
  "font-src 'self' https://fonts.gstatic.com",
  // API calls: Cloudinary upload, Pollinations, GlitchTip/Sentry
  "connect-src 'self' https://api.cloudinary.com https://image.pollinations.ai https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.glitchtip.com",
  // No iframes
  "frame-ancestors 'none'",
  // No plugins
  "object-src 'none'",
  // Upgrade insecure requests in production
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
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
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    filesToDeleteAfterUpload: [".next/static/**/*.map"],
  },
  webpack: {
    treeshake: { removeDebugLogging: true },
    automaticVercelMonitors: true,
  },
});
