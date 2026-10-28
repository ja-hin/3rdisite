'use client';

import dynamic from 'next/dynamic';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { createFluid, type FluidHandle } from '@/lib/fluid';

const Orb = dynamic(() => import('./Orb'), { ssr: false });

type Ctx = { fluid: React.RefObject<FluidHandle | null>; lenis: React.RefObject<Lenis | null> };
const AtmosphereCtx = createContext<Ctx | null>(null);
export const useAtmosphere = () => useContext(AtmosphereCtx)!;

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

const ANCHOR_OFFSET = -32;

/* The element a '#hash' points at, or null when the hash is empty or not a valid selector. */
function hashTarget(hash: string): HTMLElement | null {
  if (hash.length < 2) return null;
  try { return document.querySelector<HTMLElement>(hash); } catch { return null; }
}

export default function Atmosphere({ children }: { children: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fluid = useRef<FluidHandle | null>(null);
  const lenis = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();
  const [fluidOk, setFluidOk] = useState(true);
  // without WebGL the planet cannot mount (three throws); the page still works, just without it
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const c = document.createElement('canvas');
    try { setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl'))); } catch { setWebgl(false); }
  }, []);

  useEffect(() => {
    if (!canvas.current) return;
    const small = window.innerWidth < 820;
    fluid.current = createFluid(canvas.current, {
      simRes: small ? 96 : 128,
      dyeRes: small ? 420 : 760,
      reducedMotion: reduced,
    });
    if (!fluid.current) setFluidOk(false);
    return () => { fluid.current?.destroy(); fluid.current = null; };
  }, [reduced]);

  // Scroll to a section, with Lenis when it runs, natively otherwise. The offset keeps the heading clear of the fixed nav.
  // The target is measured from the real scroll position: Lenis's own copy can be stale right after the browser restores scroll.
  const goTo = useCallback((el: HTMLElement, immediate: boolean) => {
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET);
    if (lenis.current) lenis.current.scrollTo(top, { immediate });
    else window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    if (reduced) return;
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.current = l;
    let raf = 0;
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); l.destroy(); lenis.current = null; };
  }, [reduced]);

  // In-page anchor links glide to their section and put the hash in the URL, so the address can be copied and shared.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!;
      if (id.length < 2) return;
      const el = hashTarget(id);
      if (!el) return;
      e.preventDefault();
      goTo(el, false);
      const next = id === '#top' ? `${location.pathname}${location.search}` : id;
      if (location.hash !== (id === '#top' ? '' : id)) history.pushState(null, '', next);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [goTo]);

  // Direct links such as /#contact or /services/automation-ai#workflow land on the section itself.
  // The browser jumps before hydration, but the layout still moves (pinned services, fonts, images), so re-aim once it settles.
  useEffect(() => {
    const jump = () => { const el = hashTarget(location.hash); if (el) goTo(el, true); };
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(jump); });
    const settle = window.setTimeout(jump, 700);
    if (document.readyState !== 'complete') window.addEventListener('load', jump);
    document.fonts?.ready.then(jump).catch(() => {});
    // typing a new hash or using back/forward lands on that section at once, like the browser's own behaviour
    const onHash = () => { const el = hashTarget(location.hash); if (el) goTo(el, true); };
    window.addEventListener('hashchange', onHash);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener('load', jump);
      window.removeEventListener('hashchange', onHash);
    };
  }, [goTo]);

  return (
    <AtmosphereCtx.Provider value={{ fluid, lenis }}>
      <div className="atmos" aria-hidden="true">
        <div className="atmos-base" />
        {fluidOk && <canvas ref={canvas} className="fluid-canvas" />}
        {webgl && <Orb reduced={reduced} />}
        <div className="atmos-grain" />
      </div>
      {children}
    </AtmosphereCtx.Provider>
  );
}
