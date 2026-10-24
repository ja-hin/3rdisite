'use client';

import { useEffect, useState } from 'react';
import { useAtmosphere } from './Atmosphere';
import { Brand } from './Brand';

const links = [
  ['Services', '#services'],
  ['AI products', '#products'],
  ['Work', '#work'],
  ['About', '#approach'],
  ['Insights', '#insights'],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <Brand href="#top" />
      <nav className="nav-links" aria-label="Primary">
        {links.map(([l, h]) => (
          <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>
        ))}
      </nav>
      <a href="#contact" className="btn btn-dark nav-cta">Talk to us</a>
      <button className="nav-toggle" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span /><span />
      </button>
    </header>
  );
}

const chips = [
  { k: 'Ideas', v: 'Content & creative', c: 'var(--iris)', a: -58 },
  { k: 'Audience', v: 'Marketing & outreach', c: 'var(--lumen)', a: 8 },
  { k: 'Customers', v: 'Sales & growth', c: 'var(--bloom)', a: 74 },
  { k: 'Automation', v: 'Work smarter', c: 'var(--ember)', a: 172 },
];

export function Hero() {
  const { fluid } = useAtmosphere();
  const lines = ['We help businesses', 'acquire customers,', 'grow sales and', 'market smarter.'];
  return (
    <section id="top" className="hero" data-orb="0.48 0.02 1 0.2" data-orb-m="0 0.5 0.78 0.2">
      <div className="hero-copy">
        <p className="hero-kicker">Growth, marketing and AI</p>
        <h1 className="hero-title" aria-label={lines.join(' ')}>
          {lines.map((l, i) => (
            <span className="line" key={i} aria-hidden="true">
              <span style={{ animationDelay: `${0.15 + i * 0.11}s` }}>{l}</span>
            </span>
          ))}
        </h1>
        <p className="hero-sub">
          From e-commerce and B2B customer acquisition to content, performance marketing and AI automation,
          3rd i Visuals combines strategy and execution to build practical growth engines for businesses.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-solid" onMouseEnter={() => fluid.current?.burst(2)}>
            Discuss your growth challenge
          </a>
          <a href="#services" className="btn btn-ghost">Explore our services</a>
        </div>
      </div>

      <div className="hero-ring" aria-label="What we work on">
        {chips.map((c) => (
          <div className="chip" key={c.k} style={{ ['--a' as string]: `${c.a}deg`, ['--c' as string]: c.c }}>
            <span className="chip-dot" />
            <span>
              <strong>{c.k}</strong>
              <em>{c.v}</em>
            </span>
          </div>
        ))}
      </div>

      <div className="hero-foot">
        <span>Move your cursor. The ink follows.</span>
        <span className="scroll-cue" aria-hidden="true"><i /></span>
      </div>
    </section>
  );
}
