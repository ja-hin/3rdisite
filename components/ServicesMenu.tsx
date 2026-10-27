'use client';

import { ACCENTS, SERVICE_PAGES } from '@/lib/services';

/*
 * "Services" in the header: the link itself goes to /services; hovering (or focusing) it
 * opens a card with the four service pages. Inside the phone menu the card is shown inline.
 */
export function ServicesMenu({ current = false, onNavigate }: { current?: boolean; onNavigate?: () => void }) {
  return (
    <div className="nav-item">
      <a href="/services" className={current ? 'is-current' : undefined} aria-current={current ? 'page' : undefined} aria-haspopup="true" onClick={onNavigate}>
        Services
        <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </a>
      <div className="nav-menu">
        <div className="nav-menu-card" role="menu" aria-label="Service pages">
          {SERVICE_PAGES.map((p) => (
            <a key={p.key} href={p.href} role="menuitem" style={{ ['--c' as string]: ACCENTS[p.key].main }} onClick={onNavigate}>
              <span className="nav-menu-dot" aria-hidden="true" />
              <span>
                <strong>{p.name}</strong>
                <em>{p.tagline}</em>
              </span>
            </a>
          ))}
          <a href="/services" className="nav-menu-all" role="menuitem" onClick={onNavigate}>All services →</a>
        </div>
      </div>
    </div>
  );
}
