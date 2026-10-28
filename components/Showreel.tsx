'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtmosphere } from './Atmosphere';

/*
 * Four YouTube showreels for the "Content that works harder" section.
 * Hover (or focus) plays the video muted inside the tile; click opens it in an overlay with sound.
 */
type Reel = { id: string; t: string; d: string; h: string; vertical?: boolean; img?: string };

// img: a designed 800x1200 card in /public/assets used as the tile thumbnail (falls back to the YouTube still)
export const reels: Reel[] = [
  { id: '3kNjdHQZv_A', t: '3D showreel', d: 'Product renders and CGI that show what a camera cannot.', h: 'b', img: '/assets/reel-3d-cgi.jpg' },
  { id: 'ZuomJDeCeHQ', t: 'Product explainer & UGC', d: 'Short films that make a product easy to understand and want.', h: 'c', img: '/assets/reel-product-films.jpg' },
  { id: 'o3_zubZ9PZo', t: 'Social content', d: 'Always-on content built for the feed, the reel and the story.', h: 'd', vertical: true, img: '/assets/reel-social-content.jpg' },
  { id: 'VQoc9rvZm2A', t: 'AI video', d: 'Cinematic AI-generated films, ads and characters, directed shot by shot.', h: 'a', img: '/assets/reel-ai-video.jpg' },
];

const EMBED = 'https://www.youtube-nocookie.com/embed/';
const previewSrc = (id: string) => `${EMBED}${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`;
const fullSrc = (id: string) => `${EMBED}${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

// hqdefault always exists; maxresdefault is sharper but YouTube answers a 120px grey placeholder when it is missing
function useThumb(id: string, skip = false) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  useEffect(() => {
    if (skip) return;
    const probe = new Image();
    probe.onload = () => { if (probe.naturalWidth > 120) setSrc(probe.src); };
    probe.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }, [id, skip]);
  return src;
}

function Tile({ r, onOpen }: { r: Reel; onOpen: (r: Reel) => void }) {
  const [hot, setHot] = useState(false);
  const ytThumb = useThumb(r.id, Boolean(r.img));
  const thumb = r.img ?? ytThumb;
  return (
    <button
      type="button"
      className={`reel reel-${r.h} ${r.img ? 'has-card' : ''} ${hot ? 'is-hot' : ''}`}
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

/* Full-screen YouTube overlay with sound. Locks the page behind it and closes on Escape, backdrop click or the X. */
export function VideoLightbox({ id, title, vertical = false, onClose }: { id: string; title: string; vertical?: boolean; onClose: () => void }) {
  const { lenis } = useAtmosphere();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    lenis.current?.stop();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
      lenis.current?.start();
    };
  }, [onClose, lenis]);

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={`lightbox-frame ${vertical ? 'is-vertical' : ''}`} onClick={(e) => e.stopPropagation()}>
        <iframe src={fullSrc(id)} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
      <p className="lightbox-title">{title}</p>
      <button type="button" className="lightbox-close" aria-label="Close video" onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>,
    document.body,
  );
}

export function Showreel() {
  const [active, setActive] = useState<Reel | null>(null);
  const close = useCallback(() => setActive(null), []);
  return (
    <>
      <div className="reels">
        {reels.map((r) => <Tile key={r.id} r={r} onOpen={setActive} />)}
      </div>
      {active && <VideoLightbox id={active.id} title={active.t} vertical={active.vertical} onClose={close} />}
    </>
  );
}
