'use client';

import type { CSSProperties } from 'react';
import type { CaseIcon, Section } from '@/lib/services';
import { Eyebrow } from './Eyebrow';
import { stepState } from './effects';

export type CaseSection = Extract<Section, { type: 'case' }>;

function CaseGlyph({ kind }: { kind: CaseIcon }) {
  switch (kind) {
    case 'search':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>;
    case 'pen':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>;
    case 'folder':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" /></svg>;
    case 'approve':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="8" r="3.5" /><path d="M3.5 20c.8-3.6 3.3-5.5 6.5-5.5 1.6 0 3 .4 4.1 1.3" /><path d="M15 18.5l2 2 4-4.5" /></svg>;
    case 'send':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3L10 14" /><path d="M21 3l-7 18-4-7-7-4z" /></svg>;
  }
}

/*
 * "The workflow" case study: the animated review → publish board.
 * Rendered on the AI & automation service page and again on the home page.
 * `tick` (from useTick) drives the active step; the parent owns the data-reveal observer.
 */
export function WorkflowSection({
  s, tick, exploreHref = '#workflow', className = '', style,
}: { s: CaseSection; tick: number; exploreHref?: string; className?: string; style?: CSSProperties }) {
  const n = s.steps.length;
  return (
    <section id="workflow" className={`sp-case ${className}`} style={style}>
      <div className="sp-case-head">
        <div data-reveal={0}>
          <Eyebrow grad>{s.eyebrow}</Eyebrow>
          <h2>{s.h2a} <span className="sp-grad-text">{s.h2b}</span></h2>
        </div>
        <div className="sp-case-intro" data-reveal={120}>
          <p className="sp-para">{s.p1}</p>
          <p className="sp-para sp-para--strong">{s.p2}</p>
        </div>
      </div>

      <div className="sp-case-board" data-reveal={160}>
        <div className="sp-card-glow sp-card-glow--xl" aria-hidden="true" />
        <div className="sp-case-bar">
          <h3>The workflow</h3>
          <span className="sp-mono">{s.label}</span>
        </div>
        <ol className="sp-case-steps">
          {s.steps.map((st, i) => (
            <li key={st.t} className={`sp-case-step ${stepState(tick, n, i, 0)}`} style={{ ['--c' as string]: st.color, ['--cbg' as string]: st.bg }}>
              <div className="sp-case-top">
                <span className="sp-case-icon"><CaseGlyph kind={st.icon} /></span>
                {i < n - 1 && (
                  <span className="sp-case-wire" aria-hidden="true">
                    <i />
                    <svg viewBox="0 0 10 10"><path d="M0 0l10 5-10 5z" /></svg>
                  </span>
                )}
              </div>
              <h4><span>{i + 1}.</span>{st.t}</h4>
              <p>{st.d}</p>
            </li>
          ))}
        </ol>
        <div className="sp-case-bracket" aria-hidden="true"><span>{s.note}</span></div>
      </div>

      <div className="sp-case-foot" data-reveal={0}>
        <div className="sp-case-dark">
          <div className="sp-case-dark-glow" aria-hidden="true" />
          <h3>{s.card.h3}</h3>
          <p>{s.card.p}</p>
          <div className="sp-actions">
            <a href={exploreHref} className="btn btn-solid">{s.card.cta1}</a>
            <a href="#enquire" className="btn btn-glass">{s.card.cta2}</a>
          </div>
        </div>
        <div className="sp-case-quote">
          <span className="sp-li-badge" aria-label="LinkedIn">in</span>
          <span className="sp-vline" aria-hidden="true" />
          <p>{s.quote}</p>
        </div>
      </div>
    </section>
  );
}
