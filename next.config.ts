import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const csp = [
  "default-src 'self'",
  // Next.js inline scripts + Vercel Speed Insights + GA4's gtag.js
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  // Tailwind + Framer Motion inline styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Local images, Cloudinary responses, AI-generated images. The Google hosts
  // are GA4's no-JS pixel fallback, which it still uses in some browsers.
  "img-src 'self' data: blob: https://res.cloudinary.com https://gen.pollinations.ai https://utfs.io https://2e3n0iobhs.ufs.sh https://www.googletagmanager.com https://www.google-analytics.com",
  // Google Fonts files
  "font-src 'self' https://fonts.gstatic.com",
  // API calls: Cloudinary upload, Pollinations, GA4 measurement. GA4 resolves
  // a regional collector at runtime (`region1.google-analytics.com` and
  // friends), so the wildcards are load-bearing — pinning the bare hostnames
  // drops a share of hits with nothing in the UI to say so.
  "connect-src 'self' https://api.cloudinary.com https://gen.pollinations.ai https://utfs.io https://2e3n0iobhs.ufs.sh https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
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
  // The Open Graph routes read fonts and background photos off the filesystem
  // at request time. File tracing does not always follow a `process.cwd()`
  // join, and `public/` is CDN-served rather than guaranteed to sit next to the
  // function — so pin what they read into the bundle explicitly. Without the
  // fonts the render throws; without the photos the cards lose their imagery.
  // Only the two directories the OG routes actually read are listed: `fabrics/`
  // is several megabytes and none of it is used here.
  outputFileTracingIncludes: {
    "/api/og": ["assets/**/*", "public/cards/**/*", "public/images/**/*"],
    "/[locale]/opengraph-image": ["assets/**/*"],
  },
  async redirects() {
    return [
      // The section moved from `/products` to `/services`: it advertises what
      // Kemcon does rather than listing stock, which is what the nav has
      // always called it ("Services" / "الخدمات") and what the page's own h1
      // says. One rule covers the whole subtree — `:path*` matches zero or
      // more segments, so `/en/products` and `/en/products/curtains` both
      // land on their `/services` counterpart.
      //
      // 308 rather than 307: these URLs are indexed and in the published
      // sitemap, so the equity has to transfer permanently. Redirects are
      // checked before the filesystem, so nothing under `/services` is
      // shadowed by this.
      {
        source: "/:locale(en|ar)/products/:path*",
        destination: "/:locale/services/:path*",
        permanent: true,
      },
    ];
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
