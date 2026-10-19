'use client';

import dynamic from 'next/dynamic';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
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

export default function Atmosphere({ children }: { children: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fluid = useRef<FluidHandle | null>(null);
  const lenis = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();
  const [fluidOk, setFluidOk] = useState(true);

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

  useEffect(() => {
    if (reduced) return;
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.current = l;
    let raf = 0;
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    // in-page anchor links glide too
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); l.scrollTo(el as HTMLElement, { offset: -20 }); }
    };
    document.addEventListener('click', onClick);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('click', onClick); l.destroy(); lenis.current = null; };
  }, [reduced]);

  return (
    <AtmosphereCtx.Provider value={{ fluid, lenis }}>
      <div className="atmos" aria-hidden="true">
        <div className="atmos-base" />
        {fluidOk && <canvas ref={canvas} className="fluid-canvas" />}
        <Orb reduced={reduced} />
        <div className="atmos-grain" />
      </div>
      {children}
    </AtmosphereCtx.Provider>
  );
}
