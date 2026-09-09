/**
 * Version of the logo-mark pipeline, carried in `/api/logo` request URLs.
 *
 * Bump this whenever `@/lib/logoMark` changes what it produces. The route
 * serves marks as immutable for a year — correct, because a given upstream URL
 * always yields the same mark for a given version of that pipeline, and wrong
 * the moment the pipeline changes: a browser holding a year-long copy of an
 * older mark keeps showing it, and the fix looks like it did not work.
 *
 * This lives apart from `logoMark.ts` because the clients page is a client
 * component, and importing the pipeline there would pull sharp into the
 * browser bundle.
 */
export const MARK_VERSION = 3;
