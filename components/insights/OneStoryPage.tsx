'use client';

import { useRef, type CSSProperties } from 'react';
import Atmosphere from '@/components/Atmosphere';
import { Enquire, Footer } from '@/components/Sections';
import { Count } from '@/components/insights/Count';
import { Eyebrow } from '@/components/services/Eyebrow';
import { SiteNav } from '@/components/services/SiteNav';
import { useReveal, useTick } from '@/components/services/effects';
import { BENEFITS, CHANNELS, FOLLOW, NEXT, PHASES, PLACEMENTS, SIMPLE, type ChannelId, type OneStoryAssets, type Tone } from '@/lib/onestory';
import { ACCENTS } from '@/lib/services';

/*
 * OneStory: Human + Agentic AI social content automation.
 * Every image slot takes the file from public/assets/onestory when it exists (see app/insights/onestory/page.tsx)
 * and draws a simple fallback otherwise, so the page works before the artwork is in.
 */
const a = ACCENTS.ecommerce;
const vars = { '--a': a.main, '--a-soft': a.soft, '--a-text': a.text, '--a-light': a.light, '--a-rgb': a.rgb, '--c': a.main } as CSSProperties;
const tone = (t: Tone) => ({ ['--c' as string]: t.color, ['--ink' as string]: t.ink, ['--cbg' as string]: t.bg } as CSSProperties);
const HOOD_COUNT = PHASES.reduce((n, p) => n + p.items.length, 0);

export default function OneStoryPage({ assets }: { assets: OneStoryAssets }) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const k = useTick(1600);
  const step = k % SIMPLE.length;
  const chan = k % CHANNELS.length;
  const hood = useTick(1100) % (HOOD_COUNT + 1);
  const brochure = assets['OneStory-brochure.pdf'];
  const icon = (id: ChannelId, cls = '') => <ChannelMark id={id} src={assets[`${id}.png`]} className={cls} />;

  return (
    <Atmosphere>
      <div ref={root} className="sp os" style={vars}>
        <SiteNav current="/insights/onestory" />
        <main>
          {/* ---------- hero ---------- */}
          <section id="top" className="sp-hero os-hero" data-orb="0 0 0 0">
            <div className="sp-hero-copy">
              {assets['logo.png'] ? <img className="os-logo" src={assets['logo.png']} alt="OneStory" /> : <span className="os-logo os-wordmark" aria-label="OneStory">One<b>Story</b><i /></span>}
              <Eyebrow grad>Human + Agentic AI · Social content automation</Eyebrow>
              <h1 className="sp-h1" aria-label="One brief in. Every channel live.">
                <span className="line" aria-hidden="true"><span>One brief in.</span></span>
                <span className="line" aria-hidden="true"><span className="grad">Every channel live.</span></span>
              </h1>
              <p className="sp-lead os-lead" data-reveal={500}>Faster, on-brand social content and video across every channel, <strong>without adding headcount.</strong></p>
              <div className="sp-actions" data-reveal={650}>
                <a href="#contact" className="btn btn-solid">Book your free audit</a>
                <a href="#how" className="btn btn-ghost">See how it works <span aria-hidden="true">↓</span></a>
                {brochure && <a href={brochure} download className="btn os-btn-soft"><span aria-hidden="true">↓</span> Download brochure (PDF)</a>}
              </div>
              <p className="sp-mono os-by" data-reveal={740}>by 3rd i Visuals · Growth, Marketing &amp; Transformation</p>
            </div>

            <div className="os-orbit" data-reveal={300} aria-label="One brief, six channels">
              <div className="os-orbit-clip">
              <div className="os-orbit-spin">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(11,23,53,.13)" strokeWidth="0.35" strokeDasharray="1 1.4" />
                  {CHANNELS.map((c) => <line key={c.id} x1="50" y1="50" x2={c.cx} y2={c.cy} className="os-ray" />)}
                </svg>
                {CHANNELS.map((c) => (
                  <span key={c.id} className="os-sat" style={{ left: `${c.cx}%`, top: `${c.cy}%` }}>
                    <span className="os-sat-in">{icon(c.id, 'os-mark--lg')}</span>
                  </span>
                ))}
              </div>
              </div>
              <div className="os-core">
                <i className="os-pulse" aria-hidden="true" /><i className="os-pulse os-pulse--2" aria-hidden="true" />
                <span className="os-core-in"><OsIcon src={assets['icon.png']} className="os-core-icon" /></span>
              </div>
              <div className="os-brief-card bob" aria-hidden="true">
                <span className="sp-mono os-brief-k"><i />YOUR BRIEF</span>
                <span className="os-type"><i style={{ ['--w' as string]: '88%' } as CSSProperties} /><i style={{ ['--w' as string]: '70%' } as CSSProperties} /><i style={{ ['--w' as string]: '52%' } as CSSProperties} /></span>
              </div>
              <div className="os-approve-card bob" aria-hidden="true">
                <span className="os-tick">✓</span>
                <span><strong>One approval</strong><em>releases every channel</em></span>
              </div>
            </div>
          </section>

          {/* ---------- problem ---------- */}
          <section className="os-problem">
            <div className="os-head">
              <div data-reveal={0}>
                <Eyebrow>The problem</Eyebrow>
                <h2 className="os-h2">Social media is quietly eating your team’s week.</h2>
              </div>
              <p className="os-head-strong" data-reveal={100}>More channels shouldn’t mean more people.</p>
            </div>
            <div className="os-problems">
              <article className="os-pcard" data-reveal={0}>
                <div className="os-art os-art--cells">
                  <div className="os-cells" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 0.14).toFixed(2)}s` }} />)}</div>
                  <span className="sp-mono">5 channels × 3 posts × 2 hrs</span>
                </div>
                <span className="os-k" style={{ color: '#1f6ff5' }}>TIME</span>
                <h3><Count n={30} />+ hours a week</h3>
                <p>spent briefing, making, resizing and chasing approvals.</p>
                <p className="os-example">Example: 5 channels × 3 posts × 2 hrs</p>
              </article>
              <article className="os-pcard" data-reveal={100}>
                <div className="os-art os-art--drift" aria-hidden="true">
                  <div className="os-drift os-drift--1"><i style={{ background: '#1f6ff5' }} /><b style={{ color: '#1f6ff5' }}>LAUNCH DAY!</b></div>
                  <div className="os-drift os-drift--2"><i style={{ background: '#f0962b' }} /><b className="os-serif">Launching today…</b></div>
                  <div className="os-drift os-drift--3"><i style={{ background: '#ec4b9b' }} /><b className="sp-mono" style={{ color: '#c8307f' }}>new drop 🚀</b></div>
                </div>
                <span className="os-k" style={{ color: '#6b4ef0' }}>CONSISTENCY</span>
                <h3>Your brand drifts</h3>
                <p>Different people, tools and channels. Each sounds a bit different.</p>
              </article>
              <article className="os-pcard" data-reveal={200}>
                <div className="os-art os-art--wait" aria-hidden="true">
                  <div className="os-wait-row">
                    <span className="os-clock"><i /></span>
                    <span>Awaiting sign-off</span>
                    <span className="sp-mono os-wait-day">day 4</span>
                  </div>
                  <div className="os-track" />
                  <span className="os-crawl" />
                  <span className="os-moment"><b>the moment</b><i /></span>
                  <span className="sp-mono os-track-label">your post</span>
                </div>
                <span className="os-k" style={{ color: '#c8307f' }}>SPEED</span>
                <h3>Approved too late</h3>
                <p>Posts wait days for sign-off while the moment moves on.</p>
              </article>
            </div>
          </section>

          {/* ---------- solution ---------- */}
          <section className="sp-bleed os-dark os-solution">
            <div className="os-dark-glow os-dark-glow--solution" aria-hidden="true" />
            <div className="sp-in">
              <p className="sp-eyebrow os-eyebrow-y" data-reveal={0}><i aria-hidden="true" />The solution</p>
              <h2 className="os-h2 os-h2--17" data-reveal={80}>OneStory turns one brief into every post you need.</h2>
              <div className="os-flow" data-reveal={160}>
                <div className="os-flow-brief">
                  <span className="sp-mono os-brief-k os-brief-k--pink"><i />YOUR BRIEF</span>
                  <h3>Your brief</h3>
                  <span className="os-type os-type--light"><i style={{ ['--w' as string]: '90%' } as CSSProperties} /><i style={{ ['--w' as string]: '72%' } as CSSProperties} /><i style={{ ['--w' as string]: '56%' } as CSSProperties} /></span>
                </div>
                <div className="os-conn" aria-hidden="true"><i /></div>
                <div className="os-flow-core">
                  <span className="os-flow-icon"><i className="os-pulse" /><OsIcon src={assets['icon.png']} className="os-flow-icon-img" /></span>
                  <strong>OneStory</strong>
                  <span className="os-pill-y">Human + Agentic AI</span>
                </div>
                <div className="os-conn os-conn--2" aria-hidden="true"><i /></div>
                <div className="os-flow-channels">
                  {CHANNELS.map((c, i) => <span key={c.id} className={`os-ch ${i === chan ? 'is-act' : ''}`}>{icon(c.id)}{c.t}</span>)}
                </div>
              </div>
              <div className="os-benefits">
                {BENEFITS.map((b) => (
                  <article key={b.k} className="os-benefit" data-reveal={b.delay}>
                    <span className="os-benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={b.icon} /></svg></span>
                    <span><span className="os-benefit-k">{b.k}</span><span className="os-benefit-d">{b.d}</span></span>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ---------- how it works ---------- */}
          <section id="how" className="os-how">
            <div className="os-head">
              <div data-reveal={0}>
                <Eyebrow grad>How it works</Eyebrow>
                <h2 className="os-h2 os-h2--free">Simple steps.<br />You always stay in control.</h2>
              </div>
              <div className="os-legend" data-reveal={100}>
                <span className="os-tag" style={tone({ color: '#ec4b9b', ink: '#c8307f', bg: '#fdeef5' })}><i />YOU decide</span>
                <span className="os-tag" style={tone({ color: '#1f6ff5', ink: '#1f6ff5', bg: '#eaf2fe' })}><i />AI does the work</span>
              </div>
            </div>
            <div className="os-steps-wrap" data-reveal={140}>
              <div className="os-steps-line" aria-hidden="true"><i style={{ width: `${((step + 1) / SIMPLE.length) * 100}%` }} /></div>
              <ol className="os-steps">
                {SIMPLE.map((s, i) => (
                  <li key={s.n} className={`os-step ${i === step ? 'is-act' : ''}`} style={tone(s.tone)}>
                    <span className="os-step-num">{s.n}</span>
                    <div className="os-step-card">
                      <div className="os-step-head"><h3>{s.t}</h3><span className="os-who">{s.who}</span></div>
                      <p>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ---------- under the hood ---------- */}
          <section className="sp-section os-hood">
            <div className="os-hood-card" data-reveal={0}>
              <div className="os-hood-head">
                <div>
                  <p className="sp-eyebrow os-eyebrow-gold"><i aria-hidden="true" />Under the hood</p>
                  <h2 className="os-h2 os-h2--hood">The OneStory workflow, step by step.</h2>
                </div>
                <div className="os-legend os-legend--sm">
                  <span className="os-tag" style={tone({ color: '#ec4b9b', ink: '#c8307f', bg: '#fdeef5' })}><i />Human decision</span>
                  <span className="os-tag" style={tone({ color: '#1f6ff5', ink: '#1f6ff5', bg: '#eaf2fe' })}><i />AI-assisted work</span>
                  <span className="os-tag" style={tone({ color: '#f5c400', ink: '#8a6100', bg: '#fff7d6' })}><i />Connected platform</span>
                </div>
              </div>
              <div className="os-phases">
                {(() => { let idx = 0; return PHASES.map((ph) => (
                  <div key={ph.n} className="os-phase">
                    <div className="os-phase-head" style={tone(ph.tone)}>
                      <span className="os-phase-n">{ph.n}</span>
                      <strong>{ph.t}</strong>
                      <span className="os-who">{ph.who}</span>
                    </div>
                    {ph.items.map((item) => { const i = idx++; const on = i <= hood || hood === HOOD_COUNT; return (
                      <div key={item.tag} className={`os-hood-item ${i === hood ? 'is-act' : ''} ${on ? '' : 'is-dim'}`} style={tone(item.tone)}>
                        <span className="sp-mono os-hood-tag">{item.tag}</span>
                        <strong>{item.t}</strong>
                      </div>
                    ); })}
                  </div>
                )); })()}
              </div>
              <div className={`os-loop ${hood === HOOD_COUNT ? 'is-act' : ''}`}><span aria-hidden="true">↻</span>Learnings from step 9 shape the next brief</div>
            </div>
          </section>

          {/* ---------- sample campaign ---------- */}
          <section id="sample" className="sp-bleed os-dark os-sample">
            <div className="os-dark-glow os-dark-glow--sample" aria-hidden="true" />
            <div className="sp-in">
              <div className="os-head">
                <div data-reveal={0}>
                  <p className="sp-eyebrow os-eyebrow-y"><i aria-hidden="true" />Sample campaign · VDOFY</p>
                  <h2 className="os-h2 os-h2--free">One film.<br />Every channel.</h2>
                </div>
                <div className="os-sample-copy" data-reveal={100}>
                  <p>A “Sell the outcome” product film, adapted for five placements and published live.</p>
                  <p className="os-strong">Built and run end to end with OneStory.</p>
                </div>
              </div>
              <div className="os-placements">
                {PLACEMENTS.map((p) => (
                  <figure key={p.t} className="os-pl" data-reveal={p.delay} style={{ width: p.w }}>
                    <div className="os-pl-frame bob" style={{ padding: p.pad, borderRadius: p.r, animationDelay: p.bob }}>
                      {assets[p.img] ? (
                        <img src={assets[p.img]} alt={p.t} style={{ borderRadius: p.ir }} loading="lazy" decoding="async" />
                      ) : (
                        <div className="os-pl-ph" style={{ aspectRatio: p.ratio, borderRadius: p.ir }} aria-label={`${p.t} preview`}>
                          {icon(p.channel, 'os-mark--lg')}
                          <span className="sp-mono">{p.t}</span>
                        </div>
                      )}
                    </div>
                    <figcaption>{icon(p.channel)}{p.t}</figcaption>
                  </figure>
                ))}
              </div>
              <div className={`os-hub ${assets['vdofy-hub.png'] ? '' : 'os-hub--text'}`} data-reveal={0}>
                {assets['vdofy-hub.png'] && <img src={assets['vdofy-hub.png']} alt="VDOFY across LinkedIn, Instagram, Facebook and YouTube" loading="lazy" decoding="async" />}
                <div className="os-follow">
                  <span className="sp-mono os-follow-k">FOLLOW VDOFY</span>
                  <div className="os-follow-links">
                    {FOLLOW.map((f) => (
                      <a key={f.href} href={f.href} target="_blank" rel="noreferrer" className="os-follow-link">
                        {f.channel ? icon(f.channel) : <span className="os-ext" aria-hidden="true">↗</span>}{f.t}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- next step ---------- */}
          <section id="audit" className="os-next">
            <div className="os-head">
              <div data-reveal={0}>
                <Eyebrow grad>Next step</Eyebrow>
                <h2 className="os-h2">Try OneStory on 2 channels for 30 days.</h2>
              </div>
            </div>
            <div className="os-next-grid">
              {NEXT.map((n) => (
                <article key={n.n} className={`os-next-card ${n.hi ? 'is-hi' : ''}`} data-reveal={n.delay}>
                  <span className="os-next-n" style={{ color: n.color }}>{n.n}</span>
                  <h3>{n.t}</h3>
                  <p>{n.d}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ---------- brochure (only once the PDF is in) ---------- */}
          {brochure && (
            <section id="brochure" className="sp-section os-brochure">
              <div className="os-brochure-card" data-reveal={0}>
                <div className="os-pdf-stack" aria-hidden="true">
                  <span className="os-pdf-back" />
                  <span className="os-pdf-front bob">
                    <OsIcon src={assets['icon.png']} className="os-pdf-icon" />
                    <span className="os-pdf-copy"><b>One brief in. Every channel live.</b><i /></span>
                    <span className="sp-mono os-pdf-k">ONESTORY · PDF</span>
                  </span>
                </div>
                <div className="os-brochure-copy">
                  <span className="sp-mono os-kicker-gold">THE BROCHURE</span>
                  <h2 className="os-h2 os-h2--brochure">Take OneStory to your team.</h2>
                  <p>The problem, the workflow, the VDOFY sample campaign and the 30-day pilot, in one PDF.</p>
                  <a href={brochure} download className="btn os-btn-y"><span aria-hidden="true">↓</span> Download the brochure (PDF)</a>
                </div>
              </div>
            </section>
          )}

          {/* ---------- closing CTA ---------- */}
          <section className="sp-cta sp-bleed os-cta">
            <div className="sp-cta-glow os-cta-glow" aria-hidden="true" />
            <div className="sp-in sp-cta-in">
              <OsIcon src={assets['icon.png']} className="os-cta-icon" data-reveal={0} />
              <h2 data-reveal={60}>One brief in. Every channel live.</h2>
              <p data-reveal={120}>We review your last 90 days of posts and show where time, consistency and speed can be improved.</p>
              <a href="#contact" className="btn btn-lg os-btn-y" data-reveal={180}>Book your free audit</a>
              <nav className="os-cta-links" aria-label="Contact" data-reveal={240}>
                <a href="https://3rdivisuals.com">3rdivisuals.com</a>
                <a href="mailto:hello@3rdivisuals.com">hello@3rdivisuals.com</a>
                <a href="https://linkedin.com/company/3rdivisuals" target="_blank" rel="noreferrer">linkedin.com/company/3rdivisuals</a>
              </nav>
            </div>
          </section>

          <Enquire defaultService="Marketing automation & AI enablement" />
        </main>
        <Footer />
      </div>
    </Atmosphere>
  );
}

/* The OneStory app icon: the real file when present, otherwise a drawn mark in the same colours. */
function OsIcon({ src, className = '', ...rest }: { src?: string; className?: string; 'data-reveal'?: number }) {
  if (src) return <img src={src} alt="" className={`os-icon ${className}`} {...rest} />;
  return (
    <span className={`os-icon os-icon--drawn ${className}`} aria-hidden="true" {...rest}>
      <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="13" fill="none" stroke="#f5c400" strokeWidth="5" /><circle cx="36" cy="12" r="4.5" fill="#fff" /></svg>
    </span>
  );
}

/* A channel badge: the icon file when present, otherwise the brand colour with a simple glyph. */
function ChannelMark({ id, src, className = '' }: { id: ChannelId; src?: string; className?: string }) {
  if (src) return <img src={src} alt="" className={`os-mark os-mark--img ${className}`} />;
  const c = CHANNELS.find((x) => x.id === id)!;
  return (
    <span className={`os-mark ${className}`} style={{ background: c.color }} aria-hidden="true">
      {id === 'instagram' ? (
        <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="12" cy="12" r="3.6" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="16.6" cy="7.4" r="1.2" fill="#fff" /></svg>
      ) : id === 'youtube' ? (
        <svg viewBox="0 0 24 24"><path d="M9 7.5v9l8-4.5z" fill="#fff" /></svg>
      ) : (
        <b>{id === 'linkedin' ? 'in' : id === 'facebook' ? 'f' : id === 'x' ? 'X' : 'P'}</b>
      )}
    </span>
  );
}
