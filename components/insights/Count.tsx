'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

/* A number that counts up from zero the first time it scrolls into view. */
export function Count({ n, className, style }: { n: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !n || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const frame = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        el.textContent = String(Math.round(n * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [n]);
  return <strong ref={ref} className={className} style={style}>{n}</strong>;
}
