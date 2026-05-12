"use client";

import { useEffect, useRef, useState, startTransition } from "react";

export function LazySection({
  children,
  className,
  rootMargin = "400px",
}: {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTransition(() => setMounted(true));
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {mounted ? children : null}
    </div>
  );
}
