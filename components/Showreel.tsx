'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtmosphere } from './Atmosphere';

/*
 * Four YouTube showreels for the "Content that works harder" section.
 * Hover (or focus) plays the video muted inside the tile; click opens it in an overlay with sound.
 */
type Reel = { id: string; t: string; d: string; h: string; vertical?: boolean };

export const reels: Reel[] = [
  { id: '3kNjdHQZv_A', t: '3D showreel', d: 'Product renders and CGI that show what a camera cannot.', h: 'b' },
  { id: 'ZuomJDeCeHQ', t: 'Product explainer & UGC', d: 'Short films that make a product easy to understand and want.', h: 'c' },
  { id: 'o3_zubZ9PZo', t: 'Social content', d: 'Always-on content built for the feed, the reel and the story.', h: 'd', vertical: true },
  { id: 'VQoc9rvZm2A', t: 'AI video', d: 'Cinematic AI-generated films, ads and characters, directed shot by shot.', h: 'a' },
];

const EMBED = 'https://www.youtube-nocookie.com/embed/';
const previewSrc = (id: string) => `${EMBED}${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`;
const fullSrc = (id: string) => `${EMBED}${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

// hqdefault always exists; maxresdefault is sharper but YouTube answers a 120px grey placeholder when it is missing
function useThumb(id: string) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  useEffect(() => {
    const probe = new Image();
    probe.onload = () => { if (probe.naturalWidth > 120) setSrc(probe.src); };
    probe.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }, [id]);
  return src;
}

function Tile({ r, onOpen }: { r: Reel; onOpen: (r: Reel) => void }) {
  const [hot, setHot] = useState(false);
  const thumb = useThumb(r.id);
  return (
    <button
      type="button"
      className={`reel reel-${r.h} ${hot ? 'is-hot' : ''}`}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      onClick={() => onOpen(r)}
      aria-label={`Play ${r.t}`}
    >
      <div className="reel-media" aria-hidden="true">
        <img className="reel-thumb" src={thumb} alt="" decoding="async" />
        {hot && <iframe src={previewSrc(r.id)} title={r.t} allow="autoplay; encrypted-media" tabIndex={-1} />}
      </div>
      <span className="reel-play" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
      </span>
      <div className="reel-meta">
        <h3>{r.t}</h3>
        <p>{r.d}</p>
      </div>
    </button>
  );
}

export function Showreel() {
  const [active, setActive] = useState<Reel | null>(null);
  const { lenis } = useAtmosphere();
  const close = useCallback(() => setActive(null), []);

  // lock the page behind the overlay and close on Escape
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    lenis.current?.stop();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
      lenis.current?.start();
    };
  }, [active, close, lenis]);

  return (
    <>
      <div className="reels">
        {reels.map((r) => <Tile key={r.id} r={r} onOpen={setActive} />)}
      </div>
      {active && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.t} onClick={close}>
          <div className={`lightbox-frame ${active.vertical ? 'is-vertical' : ''}`} onClick={(e) => e.stopPropagation()}>
            <iframe src={fullSrc(active.id)} title={active.t} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          </div>
          <p className="lightbox-title">{active.t}</p>
          <button type="button" className="lightbox-close" aria-label="Close video" onClick={close}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}
