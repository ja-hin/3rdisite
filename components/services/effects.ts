'use client';

import { useEffect, useState, type RefObject } from 'react';

/*
 * Scroll-in reveals. Any element with data-reveal="<delay ms>" inside `root` starts hidden
 * (when it is below the fold) and fades up once it enters the viewport. A [data-fill] bar
 * inside a revealed element grows to full width shortly after.
 */
export function useReveal(root: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fill = (node: Element, delay: number) => {
      const bars = node.querySelectorAll<HTMLElement>('[data-fill]');
      if (bars.length) setTimeout(() => bars.forEach((b) => b.classList.add('is-full')), delay + 200);
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const node = e.target as HTMLElement;
          const d = Number(node.dataset.reveal || 0);
          setTimeout(() => node.classList.add('is-in'), d);
          fill(node, d);
          io.unobserve(node);
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    items.forEach((node) => {
      const below = node.getBoundingClientRect().top > window.innerHeight * 0.9;
      if (!reduce && below) node.classList.add('rv');
      else {
        node.classList.add('is-in');
        fill(node, 200);
      }
      io.observe(node);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* A counter that increments every `ms` milliseconds. Drives the little step animations. */
export function useTick(ms: number, running = true) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setK((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms, running]);
  return k;
}

/* Which step of a chain is active for a given tick. `rest` adds idle beats at the end of the cycle. */
export const stepState = (k: number, length: number, i: number, rest = 2) => {
  const cur = k % (length + rest);
  return i === cur ? 'is-act' : i < cur ? 'is-done' : '';
};

/* Nav state: `scrolled` after a few pixels, `past` once the first screen has been scrolled away. */
export function useNavState() {
  const [s, setS] = useState({ scrolled: false, past: false });
  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setS({ scrolled: y > 24, past: y > window.innerHeight * 0.85 });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return s;
}

/* Make sure muted background videos actually start; React does not always write the muted attribute. */
export function useAutoplay(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    root.current?.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((v) => {
      v.muted = true;
      v.play?.().catch(() => {});
    });
  }, [root]);
}
