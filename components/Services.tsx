'use client';

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export const services = [
  {
    title: 'Content, creative & communication',
    hue: 0,
    color: 'var(--iris)',
    body: 'Build communication that gets noticed and helps customers understand, trust and choose your brand.',
    items: ['Content strategy', 'Social media', 'Video & AI video', '3D & CGI', 'Performance creatives', 'Campaigns'],
    cta: 'Explore content & creative',
    href: '/services/content-creative',
    glyph: 'lens',
  },
  {
    title: 'E-commerce & digital sales growth',
    hue: 0.25,
    color: 'var(--lumen)',
    body: 'Grow sales across marketplaces and your own digital channels, with strategy and execution managed together.',
    items: ['Amazon & marketplace management', 'D2C & websites', 'Marketplace SEO', 'Amazon PPC', 'Google & Meta ads', 'Conversion optimisation'],
    cta: 'Explore e-commerce growth',
    href: '/services/ecommerce-growth',
    glyph: 'cart',
  },
  {
    title: 'Marketing automation & AI enablement',
    hue: 0.5,
    color: 'var(--bloom)',
    body: 'Find repetitive, inefficient processes and make them faster, simpler and more intelligent.',
    items: ['Marketing automation', 'CRM workflows', 'AI agents', 'Lead qualification', 'Email & WhatsApp automation', 'Dashboards & reporting'],
    cta: 'Explore AI & automation',
    href: '/services/automation-ai',
    glyph: 'nodes',
  },
  {
    title: 'B2B lead generation & sales outreach',
    hue: 0.75,
    color: 'var(--ember)',
    body: 'Build a structured outbound engine that identifies the right prospects and creates qualified sales opportunities.',
    items: ['ICP & database building', 'Cold email outreach', 'LinkedIn outreach', 'Appointment setting', 'Follow-ups & CRM', 'Inside sales support'],
    cta: 'Explore B2B lead generation',
    href: '/services/b2b-lead-generation',
    glyph: 'target',
  },
];

function Glyph({ kind }: { kind: string }) {
  // small looping line-art, one per service
  if (kind === 'lens')
    return (
      <svg viewBox="0 0 120 120" className="glyph">
        <circle cx="60" cy="60" r="46" /><circle cx="60" cy="60" r="30" className="spin" />
        <circle cx="60" cy="60" r="12" className="fill" /><path d="M60 14v10M60 96v10M14 60h10M96 60h10" />
      </svg>
    );
  if (kind === 'cart')
    return (
      <svg viewBox="0 0 120 120" className="glyph">
        <path d="M18 30h14l12 48h46l10-34H38" /><circle cx="50" cy="92" r="6" /><circle cx="84" cy="92" r="6" />
        <path d="M58 58l10-12 10 8 12-16" className="draw" />
      </svg>
    );
  if (kind === 'nodes')
    return (
      <svg viewBox="0 0 120 120" className="glyph">
        <path d="M30 34L60 60L92 30M60 60L60 96M30 34L30 84L60 96" />
        <circle cx="30" cy="34" r="7" className="fill pulse" /><circle cx="92" cy="30" r="7" />
        <circle cx="60" cy="60" r="9" className="fill" /><circle cx="60" cy="96" r="7" /><circle cx="30" cy="84" r="6" className="pulse" />
      </svg>
    );
  return (
    <svg viewBox="0 0 120 120" className="glyph">
      <circle cx="60" cy="60" r="46" /><circle cx="60" cy="60" r="30" /><circle cx="60" cy="60" r="13" className="fill pulse" />
      <path d="M96 24L66 54" className="draw" /><path d="M96 24l-2 12M96 24l-12 2" />
    </svg>
  );
}

function Card({ s, i }: { s: (typeof services)[number]; i: number }) {
  return (
    <article className="svc" style={{ ['--c' as string]: s.color }}>
      <div className="svc-glow" />
      <header className="svc-head">
        <Glyph kind={s.glyph} />
        <span className="svc-count">{i + 1} of 4</span>
      </header>
      <h3>{s.title}</h3>
      <p>{s.body}</p>
      <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
      <a href={s.href} className="svc-link">{s.cta}</a>
    </article>
  );
}

export function Services() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth >= 1024;
      setWide(w);
      if (track.current && clip.current && w) setDist(Math.max(0, track.current.scrollWidth - clip.current.clientWidth + 24));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 28, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0.04, 0.96], ['0%', '100%']);

  // tint the eye with whichever service is in front
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!wrap.current) return;
    const idx = Math.min(3, Math.max(0, Math.floor(v * 4)));
    wrap.current.dataset.orb = `-0.78 0.72 0.28 ${services[idx].hue}`;
  });

  return (
    <section id="services" ref={wrap} className={`services ${wide ? 'is-pinned' : ''}`} data-orb="-0.78 0.72 0.28 0" data-orb-m="0 0 0 0"
      style={wide ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className="services-sticky">
        <div className="services-intro">
          <h2>One partner.<br />Four ways to grow.</h2>
          <p>
            You may need better content. More online sales. A stronger B2B pipeline. Or less manual work in your
            marketing and sales operations. We bring these capabilities together, or work on just the area you need.
          </p>
          {wide && (
            <div className="services-progress" aria-hidden="true"><motion.i style={{ width: bar }} /></div>
          )}
        </div>
        <div className="track-clip" ref={clip}>
          <motion.div ref={track} className="services-track" style={wide ? { x } : undefined}>
            {services.map((s, i) => <Card key={s.title} s={s} i={i} />)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const reframes = [
  ['A marketplace problem', 'may be a content problem.'],
  ['A lead-generation problem', 'may be a positioning problem.'],
  ['A paid-media problem', 'may be a conversion problem.'],
  ['A growing team', 'may be spending hours on work that should be automated.'],
];

const steps = [
  { t: 'Strategy', d: 'Understand the business', c: 'var(--lumen)', icon: 'compass' },
  { t: 'Execution', d: 'Implement the right solution', c: 'var(--iris)', icon: 'gear' },
  { t: 'Measurement', d: 'Track what matters', c: 'var(--bloom)', icon: 'chart' },
  { t: 'Improvement', d: 'Optimise and scale', c: 'var(--ember)', icon: 'rocket' },
];

function StepIcon({ kind }: { kind: string }) {
  if (kind === 'compass')
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="17" />
        <path d="M31 17l-4.5 10.5L16 32l4.5-10.5z" className="fill-soft" />
        <circle cx="24" cy="24" r="2.2" className="fill" />
      </svg>
    );
  if (kind === 'gear')
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 8l3 4.5 5.3-1.3 1.3 5.3L38 19.5l-2.2 5 3.2 4.3-4.3 3.2.8 5.4-5.4.8-1.9 5.1L24 41l-4.2 2.3-1.9-5.1-5.4-.8.8-5.4-4.3-3.2 3.2-4.3-2.2-5 4.4-3L15.7 11.2 21 12.5z" />
        <circle cx="24" cy="24" r="6" className="fill-soft" />
      </svg>
    );
  if (kind === 'chart')
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 39h30" />
        <rect x="13" y="24" width="6" height="12" rx="1.5" className="fill-soft" />
        <rect x="22" y="16" width="6" height="20" rx="1.5" className="fill-soft" />
        <rect x="31" y="10" width="6" height="26" rx="1.5" className="fill-soft" />
        <path d="M12 20l9-7 8 4 10-9" className="line-top" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M27 9c6-1 11 4 10 10l-10 10-7-7z" className="fill-soft" />
      <path d="M20 22l-6 1-4 5 7 1M26 32l1 7 5-4-1-6" />
      <path d="M14 34l-4 4M17 38l-3 3M11 31l-3 3" />
      <circle cx="31" cy="17" r="2.2" className="fill" />
    </svg>
  );
}

export function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(3, Math.floor(v * 4.6) - 0)));

  return (
    <section id="approach" className="approach" data-orb="0 0 0 0.25" data-orb-m="0 0 0 0">
      <div className="approach-copy">
        <p className="kicker">Our approach</p>
        <h2>Growth problems rarely sit inside one marketing channel.</h2>
        <ul className="reframes">
          {reframes.map(([a, b]) => (
            <li key={a} className="reframe">
              <span className="rf-a">{a}</span> <span className="rf-b">{b}</span>
            </li>
          ))}
        </ul>
        <p className="approach-close">We look at the business first. Then decide what needs to be fixed.</p>
      </div>

      <div className="process" ref={ref} aria-label="How we work">
        {steps.map((st, i) => (
          <div key={st.t} className={`step ${active >= i ? 'is-on' : ''}`} style={{ ['--c' as string]: st.c }}>
            {i > 0 && (
              <svg className="step-arrow" viewBox="0 0 40 16" aria-hidden="true">
                <path d="M2 8h32M28 2l6 6-6 6" />
              </svg>
            )}
            <span className="step-badge">
              <StepIcon kind={st.icon} />
              <i className="step-pulse" />
            </span>
            <h3>{st.t}</h3>
            <p>{st.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
