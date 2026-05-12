import * as Sentry from "@sentry/nextjs";

// Client-side Sentry is initialised in sentry.client.config.ts.
// This file only exports the Next.js 15 router transition hook.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
