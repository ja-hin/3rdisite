'use client';

import { useState } from 'react';
import { Brand } from '@/components/Brand';
import { ServicesMenu } from '@/components/ServicesMenu';
import { useNavState } from './effects';

const links: [string, string][] = [
  ['AI products', '/#products'],
  ['Work', '/#work'],
  ['About', '/#approach'],
  ['Insights', '/#insights'],
];

/* Fixed header for the services pages: transparent at the top, a glass bar once scrolled. */
export function SiteNav({ current = '/services' }: { current?: string }) {
  const { scrolled } = useNavState();
  const [open, setOpen] = useState(false);
  const cls = ['nav', scrolled ? 'is-scrolled' : '', open ? 'is-open' : ''].filter(Boolean).join(' ');
  return (
    <header className={cls}>
      <Brand />
      <nav className="nav-links" aria-label="Primary">
        <ServicesMenu current={current === '/services'} onNavigate={() => setOpen(false)} />
        {links.map(([l, h]) => (
          <a key={h} href={h} aria-current={h === current ? 'page' : undefined} className={h === current ? 'is-current' : undefined} onClick={() => setOpen(false)}>
            {l}
          </a>
        ))}
      </nav>
      <a href="#contact" className="btn btn-dark nav-cta">Talk to us</a>
      <button className="nav-toggle" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span /><span />
      </button>
    </header>
  );
}
