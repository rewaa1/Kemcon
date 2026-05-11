export function ConfiguratorSkeleton() {
  return (
    <div className="relative min-h-screen pt-20 pb-48 bg-[var(--color-bg-secondary)] animate-pulse">
      {/* Top sticky bar */}
      <div className="sticky top-20 z-30 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-deep-accent)]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <div className="h-4 w-24 bg-[var(--color-surface)] rounded" />
          <div className="h-4 w-20 bg-[var(--color-surface)] rounded" />
          <div className="w-24" />
        </div>
        {/* Step dots */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-[var(--color-surface)]" />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Step heading */}
        <div className="space-y-3 text-center">
          <div className="h-7 w-48 bg-[var(--color-surface)] rounded mx-auto" />
          <div className="h-4 w-64 bg-[var(--color-surface)] rounded mx-auto" />
        </div>

        {/* Option grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[var(--color-surface)] rounded-sm" />
          ))}
        </div>
      </div>

      {/* Bottom nav bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="glass-card rounded-sm px-4 py-3 flex items-center justify-between gap-3 pointer-events-auto">
            <div className="h-9 w-20 bg-[var(--color-surface)] rounded-sm" />
            <div className="h-9 w-28 bg-[var(--color-surface)] rounded-sm ms-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
