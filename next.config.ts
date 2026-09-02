import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
  // API calls: Cloudinary upload, Pollinations
  "connect-src 'self' https://api.cloudinary.com https://gen.pollinations.ai https://utfs.io https://2e3n0iobhs.ufs.sh",
  // No iframes
  "frame-ancestors 'none'",
  // No plugins
  "object-src 'none'",
  // Upgrade insecure requests in production
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  // The root layout sits under a dynamic `[locale]` segment, so an unmatched
  // URL has no locale to compose a 404 from and Next falls back to its own
  // bare error page. `global-not-found.tsx` is the supported way to brand that
  // case — the alternative, a `[locale]/[...slug]` catch-all, shadows every
  // nested route (`/en/products/design-plan` and friends 404'd because of it).
  experimental: {
    globalNotFound: true,
  },
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

export default withNextIntl(nextConfig);
