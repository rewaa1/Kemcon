/**
 * Mirrors `ProductEnquiryForm`'s own hydration shell so the route does not
 * flash a different silhouette on its way to the form.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1A1D24] pt-28 pb-24 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="h-8 w-40 rounded-sm bg-[var(--color-surface)]" />
        <div className="h-24 rounded-sm bg-[var(--color-surface)]" />
        <div className="h-56 rounded-sm bg-[var(--color-surface)]" />
      </div>
    </div>
  );
}
