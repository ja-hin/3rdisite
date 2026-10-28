'use client';

import { useRef, type CSSProperties } from 'react';
import Atmosphere from '@/components/Atmosphere';
import { Enquire, Footer } from '@/components/Sections';
import { ACCENTS, SERVICE_DATA, SERVICE_PAGES, pad, pageByKey, type Section, type ServiceKey, type ServicePageMeta } from '@/lib/services';
import { Eyebrow } from './Eyebrow';
import { SiteNav } from './SiteNav';
import { WorkflowSection } from './Workflow';
import { stepState, useAutoplay, useReveal, useTick } from './effects';

type Ctx = { tick: number; hue: number; others: ServicePageMeta[]; capId: string };

export default function ServicePage({ service }: { service: ServiceKey }) {
  const a = ACCENTS[service];
  const meta = pageByKey(service);
  const sections = SERVICE_DATA[service];
  const others = SERVICE_PAGES.filter((p) => p.key !== service);
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, [service]);
  useAutoplay(root);
  const tick = useTick(1000);

  // the B2B page uses the flow strip as its "capabilities" anchor, so its cards take another id
  const capId = sections.some((s) => s.type === 'flow' && s.anchor === 'capabilities') ? 'what-we-do' : 'capabilities';
  const ctx: Ctx = { tick, hue: a.hue, others, capId };
  const vars = { '--a': a.main, '--a-soft': a.soft, '--a-text': a.text, '--a-light': a.light, '--a-rgb': a.rgb, '--c': a.main } as CSSProperties;

  return (
    <Atmosphere>
      <div ref={root} className="sp" style={vars}>
        <SiteNav current="/services" />
        <main>
          {sections.map((s, i) => (
            <SectionView key={`${s.type}-${i}`} s={s} ctx={ctx} />
          ))}
          <Enquire defaultService={meta.formLabel} />
        </main>
        <Footer />
      </div>
    </Atmosphere>
  );
}

function SectionView({ s, ctx }: { s: Section; ctx: Ctx }) {
  const { tick, hue, others, capId } = ctx;

  switch (s.type) {
    case 'hero': {
      const chain = s.chain ?? [];
      const wrap = chain.length > 5;
      return (
        <section id="top" className="sp-hero" data-orb="0 0 0 0">
          <div className="sp-hero-copy">
            <Eyebrow grad>{s.eyebrow}</Eyebrow>
            <h1 className="sp-h1" aria-label={`${s.h1a} ${s.h1b}`}>
              <span className="line" aria-hidden="true"><span>{s.h1a}</span></span>
              <span className="line" aria-hidden="true"><span className="grad">{s.h1b}</span></span>
            </h1>
            <p className="sp-lead" data-reveal={500}>{s.p1}</p>
            <p className="sp-lead sp-lead--strong" data-reveal={600}>{s.p2}</p>
            <div className="sp-actions" data-reveal={700}>
              <a href="#contact" className="btn btn-solid">{s.cta1}</a>
              <a href="#capabilities" className="btn btn-ghost">{s.cta2}</a>
            </div>
          </div>

          <div className="sp-visual" data-reveal={300}>
            {s.vis === 'tiles' && (
              <div className="sp-tiles">
                {s.tiles!.map((t, i) => (
                  <div key={t.tag} className="sp-tile bob" style={{ gridRow: t.row, gridColumn: t.col, ['--i' as string]: i }}>
                    <img src={t.img} alt={t.tag} loading="eager" decoding="async" />
                    <i className="sp-tile-shade" aria-hidden="true" />
                    <span className="sp-tile-tag">{t.tag}</span>
                  </div>
                ))}
              </div>
            )}

            {s.vis === 'media' && (
              <>
                <div className="sp-media">
                  {s.video ? (
                    <video data-autoplay="" src={s.video} poster={s.img} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
                  ) : (
                    <img src={s.img} alt="" loading="eager" decoding="async" />
                  )}
                  <i className="sp-media-shade" aria-hidden="true" />
                </div>
                {s.sources?.length ? (
                  <div className="sp-sources" aria-hidden="true">
                    {s.sources.map((src, i) => (
                      <div key={src} className="sp-source bob" style={{ ['--i' as string]: i }}>
                        <span className="sp-source-dot" />{src}
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="sp-chain-card bob" style={{ ['--i' as string]: 3 }} aria-hidden="true">
                  <span className="sp-mono sp-chain-label">{s.chainLabel}</span>
                  <div className={wrap ? 'sp-chain-wrap' : 'sp-chain-list'}>
                    {chain.map((c, i) => (
                      <span key={c} className={`sp-chain-step ${wrap ? 'is-pill' : ''} ${stepState(tick, chain.length, i)}`}>
                        {!wrap && <span className="sp-mono">{pad(i)}</span>}
                        {c}
                      </span>
                    ))}
                  </div>
                  {s.end && <div className="sp-chain-end">{s.end}</div>}
                </div>
              </>
            )}
          </div>
        </section>
      );
    }

    case 'prop':
      return (
        <section className="sp-prop" data-orb={`-0.72 -0.5 0.36 ${hue}`} data-orb-m="0 0 0 0">
          <h2 data-reveal={0}>{s.h2}</h2>
          <div className="sp-prop-body" data-reveal={120}>
            {s.p.map((p) => <p key={p} className="sp-para">{p}</p>)}
            <p className="sp-hl">{s.hl}</p>
          </div>
        </section>
      );

    case 'cards':
      return (
        <section id={capId} className="sp-section">
          <Eyebrow reveal={0}>{s.eyebrow}</Eyebrow>
          <div className="sp-cards">
            {s.cards.map((c, i) => (
              <article key={c.t} className="sp-card" data-reveal={(i % 2) * 120}>
                <div className="sp-card-glow" aria-hidden="true" />
                <span className="sp-card-num">{pad(i)}</span>
                <h3>{c.t}</h3>
                <p className="sp-card-sub">{c.sub}</p>
                <p className="sp-card-body">{c.body}</p>
              </article>
            ))}
          </div>
        </section>
      );

    case 'paths':
      return (
        <section id="capabilities" className="sp-section sp-paths">
          {s.panels.map((pn, i) => (
            <article key={pn.t} className="sp-panel" data-reveal={i * 140}>
              <div className="sp-card-glow sp-card-glow--lg" aria-hidden="true" />
              <span className="sp-panel-tag">{pn.tag}</span>
              <h3>{pn.t}</h3>
              <p className="sp-panel-intro">{pn.intro}</p>
              <ul className="sp-panel-list">
                {pn.items.map((it, j) => (
                  <li key={it.t}>
                    <span className="sp-mono sp-li-num">{pad(j)}</span>
                    <span>
                      <strong>{it.t}</strong>
                      <span className="sp-li-d">{it.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      );

    case 'flow': {
      const n = s.steps.length;
      return (
        <section id={s.anchor || 'journey'} className="sp-section sp-flow">
          <h2 data-reveal={0}>{s.h2}</h2>
          <div className="sp-flow-box" data-reveal={120}>
            <ol className="sp-flow-steps" style={{ ['--min' as string]: s.minCol || '180px' }}>
              {s.steps.map((st, i) => (
                <li key={st.t} className={`sp-flow-step ${stepState(tick, n, i, 0)}`}>
                  <span className="sp-flow-head sp-mono">
                    {pad(i)}
                    <span>{i < n - 1 ? '→' : ''}</span>
                  </span>
                  <strong>{st.t}</strong>
                  {st.d && <span className="sp-flow-d">{st.d}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    }

    case 'bands':
      return (
        <section className="sp-section sp-bands">
          <h2 data-reveal={0}>{s.h2}</h2>
          <div className="sp-bands-stack">
            <div className="sp-band sp-band--before" data-reveal={0}>
              <span className="sp-mono sp-band-k">BEFORE</span>
              <p>{s.before}</p>
            </div>
            <div className="sp-band sp-band--dark" data-reveal={100}>
              <span className="sp-mono sp-band-k">CONNECTED WORKFLOW</span>
              <ol className="sp-band-chain">
                {s.chain.map((c, i) => (
                  <li key={c}>
                    <span className={`sp-pill ${stepState(tick, s.chain.length, i)}`}>{c}</span>
                    {i < s.chain.length - 1 && <span className="sp-band-arrow">→</span>}
                  </li>
                ))}
              </ol>
            </div>
            <div className="sp-band sp-band--outcome" data-reveal={200}>
              <span className="sp-mono sp-band-k">INTENDED OUTCOME</span>
              <p>{s.outcome}</p>
            </div>
            <p className="sp-band-note">{s.note}</p>
          </div>
        </section>
      );

    case 'split':
      return (
        <section className="sp-section sp-split">
          <div className="sp-split-in">
            <div className="sp-split-img" data-reveal={0}>
              <img src={s.img} alt="" loading="lazy" decoding="async" />
              <i aria-hidden="true" />
            </div>
            <div className="sp-split-body" data-reveal={120}>
              <h2>{s.h2}</h2>
              {s.p.map((p) => <p key={p} className="sp-para">{p}</p>)}
              {s.chain && (
                <ol className="sp-split-chain">
                  {s.chain.map((c, i) => (
                    <li key={c}>
                      <span className="sp-pill sp-pill--ink">{c}</span>
                      {i < s.chain!.length - 1 && <span className="sp-split-arrow">→</span>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>
      );

    case 'eco':
      return (
        <section className="sp-eco sp-bleed">
          <div className="sp-eco-glow" aria-hidden="true" />
          <div className="sp-in">
            <Eyebrow light reveal={0}>The ecosystem advantage</Eyebrow>
            <h2 data-reveal={80}>{s.h2}</h2>
            <div className="sp-eco-grid">
              {s.items.map((it, i) => (
                <article key={it.q} className="sp-eco-card" data-reveal={i * 110}>
                  <span className="sp-mono sp-eco-num">{pad(i)}</span>
                  <h3>{it.q}</h3>
                  <p className="sp-eco-a"><span>→</span>{it.a}</p>
                </article>
              ))}
            </div>
            <h3 className="sp-eco-close" data-reveal={0}>{s.close}</h3>
          </div>
        </section>
      );

    case 'how':
      return (
        <section className="sp-how">
          <Eyebrow reveal={0}>How we work</Eyebrow>
          <div className="sp-rail" data-reveal={100}>
            <div className="sp-rail-line" aria-hidden="true"><i data-fill="" /></div>
            <ol className="sp-rail-steps">
              {s.steps.map((st, i) => (
                <li key={st.t}>
                  <span className="sp-rail-badge">{pad(i)}</span>
                  <h3>{st.t}</h3>
                  <p>{st.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );

    case 'three': {
      const dots = [['var(--a)'], ['var(--a)', '#6b4ef0'], ['var(--a)', '#6b4ef0', '#1f7cf5', '#ec4b9b']];
      return (
        <section className="sp-section sp-three" data-orb={`0.86 0.62 0.26 ${hue}`} data-orb-m="0 0 0 0">
          <div className="sp-three-head">
            <Eyebrow reveal={0}>{s.eyebrow}</Eyebrow>
            {s.engage && <a href="#contact" className="btn btn-dark" data-reveal={80}>Talk to Us About Your Requirement</a>}
          </div>
          <div className="sp-three-grid">
            {s.items.map((it, i) => (
              <article key={it.t} className={`sp-three-card ${s.engage && i === 2 ? 'is-featured' : ''}`} data-reveal={i * 100}>
                <div className="sp-dots" aria-hidden="true">
                  {(s.engage ? dots[i] : dots[0]).map((d, j) => <span key={j} style={{ background: d }} />)}
                </div>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </article>
            ))}
          </div>
          {s.strip && (
            <a href="https://faishon.studio" target="_blank" rel="noreferrer" className="sp-strip" data-reveal={0}>
              <span className="sp-strip-copy">
                <span className="sp-strip-logo">faishon<b>.studio</b></span>
                <span><strong>We build technology too.</strong> <span className="sp-muted">3rd i Visuals also builds its own AI products, including <strong>Faishon.Studio</strong>.</span></span>
              </span>
              <span className="sp-strip-link">Explore Our AI Products →</span>
            </a>
          )}
        </section>
      );
    }

    case 'case':
      return <WorkflowSection s={s} tick={tick} className="sp-section" />;

    case 'work':
      return (
        <section className="sp-section sp-work">
          <div className="sp-work-head">
            <h2 data-reveal={0}>{s.h2}</h2>
            <a href="/#work" className="sp-link" data-reveal={80}>Explore Our Work →</a>
          </div>
          <div className="sp-work-grid">
            {s.cats.map((c, i) => (
              <article key={c} className="sp-work-card" data-reveal={i * 100}>
                <div className="sp-work-ph">
                  <img src={s.imgs[i]} alt={c} loading="lazy" decoding="async" />
                  <span className="sp-work-tag sp-mono">{s.ph}</span>
                </div>
                <div className="sp-work-body">
                  <span className="sp-work-cat">{c}</span>
                  <dl className="sp-work-dl">
                    {s.rows.map((r) => (
                      <div key={r}><dt>{r}</dt><dd>—</dd></div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="sp-cta sp-bleed">
          <div className="sp-cta-glow" aria-hidden="true" />
          <div className="sp-in sp-cta-in">
            <h2 data-reveal={0}>{s.h2}</h2>
            <p data-reveal={100}>{s.p}</p>
            <a href="#contact" className="btn btn-solid btn-lg" data-reveal={180}>{s.cta}</a>
            <nav className="sp-cta-others" aria-label="Other services" data-reveal={260}>
              <span>Other services:</span>
              {others.map((o) => <a key={o.key} href={o.href}>{o.name}</a>)}
            </nav>
          </div>
        </section>
      );
  }
}
