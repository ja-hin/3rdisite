'use client';

import { Fragment, useEffect, useRef, type CSSProperties, type RefObject } from 'react';
import Atmosphere from '@/components/Atmosphere';
import { Enquire, Footer } from '@/components/Sections';
import { Eyebrow } from '@/components/services/Eyebrow';
import { SiteNav } from '@/components/services/SiteNav';
import { useReveal, useTick } from '@/components/services/effects';
import { Count } from '@/components/insights/Count';
import { AGENTS, DESK, JOBS, LANES, LOOP, STACK, STATS, STEPS } from '@/lib/relay';
import { ACCENTS } from '@/lib/services';

/*
 * RELAY case study. Built on the service-page system (.sp) with the blue accent:
 * the hero loop animates a dot around the circle and lights the matching stage and lane,
 * the timeline fills as it scrolls past the middle of the screen, and the agent pills and cards take turns.
 */
const a = ACCENTS.ecommerce;
const vars = { '--a': a.main, '--a-soft': a.soft, '--a-text': a.text, '--a-light': a.light, '--a-rgb': a.rgb, '--c': a.main } as CSSProperties;
const cv = (c: string, cbg?: string) => ({ ['--c' as string]: c, ['--cbg' as string]: cbg } as CSSProperties);

export default function RelayPage({ brochure }: { brochure: string | null }) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  useLoop(root);
  useTimeline(root);
  const act = useTick(1700) % AGENTS.length;

  return (
    <Atmosphere>
      <div ref={root} className="sp rl" style={vars}>
        <SiteNav current="/insights/agentic-ai-relay" />
        <main>
          <section id="top" className="sp-hero rl-hero" data-orb="0 0 0 0">
            <div className="sp-hero-copy">
              <Eyebrow grad>Agentic systems · RELAY</Eyebrow>
              <h1 className="sp-h1" aria-label="Outreach that answers itself.">
                <span className="line" aria-hidden="true"><span>Outreach that</span></span>
                <span className="line" aria-hidden="true"><span className="grad">answers itself.</span></span>
              </h1>
              <p className="sp-lead" data-reveal={500}>
                A cold email goes out, asking a company whether they would like to see what your SaaS platform can do with their own products.
                A prospect says yes. Within the hour a team of AI agents has read their website, produced the sample, built the deck, and the
                reply is waiting for one human click. <strong>Then the loop closes.</strong>
              </p>
              <p className="sp-mono rl-sub" data-reveal={580}>A closed loop between your outreach platform, Claude, and a team of agents.</p>
              <div className="sp-actions" data-reveal={680}>
                {brochure ? (
                  <a href={brochure} download className="btn btn-solid"><span aria-hidden="true">↓</span> Download the brochure (PDF)</a>
                ) : (
                  <a href="#contact" className="btn btn-solid">Talk to us about RELAY</a>
                )}
                <a href="#how" className="btn btn-ghost">See how it works <span aria-hidden="true">↓</span></a>
              </div>
              <p className="rl-note" data-reveal={760}>Shown here: B2B outreach built for D2C apparel brands, India · Oct 2026</p>
            </div>

            <div className="rl-loop" data-reveal={300} aria-label="The RELAY loop: send, reply, orchestrate, make, approve, deliver">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <linearGradient id="rl-lg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6b4ef0" /><stop offset="0.5" stopColor="#1f7cf5" /><stop offset="1" stopColor="#ec4b9b" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(11,23,53,.12)" strokeWidth="0.5" />
                <circle data-arc="" cx="50" cy="50" r="38" fill="none" stroke="url(#rl-lg)" strokeWidth="1" strokeLinecap="round" strokeDasharray="0 239" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(31,111,245,.16)" strokeWidth="0.3" strokeDasharray="1 1.4" />
                <circle data-dot="" className="rl-dot" cx="50" cy="12" r="1.8" fill="#1f6ff5" />
              </svg>
              <div className="rl-core">
                <span className="rl-core-in">
                  <span className="sp-mono">REPLY → SAMPLE → LINK</span>
                  <strong>~40 min</strong>
                  <span>one loop, one human decision</span>
                </span>
              </div>
              {LOOP.map((n) => (
                <div key={n.t} data-node="" className="rl-node" style={{ left: n.x, top: n.y, ...cv(n.color, n.bg) }}>
                  <span className="rl-node-num">{n.num}</span>
                  <span><strong>{n.t}</strong><em>{n.d}</em></span>
                </div>
              ))}
            </div>
          </section>

          <section className="sp-section rl-stats" aria-label="Key numbers">
            {STATS.map((s) => (
              <div key={s.t} className="rl-stat" data-reveal={s.delay} style={{ ['--glow' as string]: s.glow } as CSSProperties}>
                <i className="rl-glow" aria-hidden="true" />
                <Count n={s.n} className="rl-stat-n" style={{ color: s.color }} />
                <span className="rl-stat-t">{s.t}</span>
                <p>{s.d}</p>
              </div>
            ))}
          </section>

          <section className="sp-bleed rl-lanes">
            <div className="rl-lanes-glow" aria-hidden="true" />
            <div className="sp-in">
              <div className="rl-head">
                <div data-reveal={0}>
                  <Eyebrow light>One loop</Eyebrow>
                  <h2 className="rl-h2">Four platforms, six stages, one human decision.</h2>
                </div>
                <p data-reveal={100}>Every hand-off between tools is an API call, logged on a live desk. Nobody copies and pastes between tools.</p>
              </div>
              <div className="rl-grid-wrap" data-reveal={160}>
                <div className="rl-grid" role="table" aria-label="Which platform is active at each stage">
                  <span />
                  {LOOP.map((n) => <span key={n.t} className="sp-mono rl-grid-col">{n.num} {n.t}</span>)}
                  {LANES.map((l) => (
                    <Fragment key={l.name}>
                      <span className="rl-grid-lane">{l.name}</span>
                      {[0, 1, 2, 3, 4, 5].map((col) => (
                        <span key={col} className="rl-grid-cell">{l.on.includes(col) && <i data-lane={col} style={{ background: l.color }} />}</span>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="how" className="rl-how">
            <div className="rl-how-side">
              <div data-reveal={0}>
                <Eyebrow grad>How it works</Eyebrow>
                <h2 className="rl-h2">One prospect’s journey through the loop.</h2>
                <p className="sp-para rl-how-p">Timed on a real run of the faishon.studio outreach.</p>
              </div>
              <div className="rl-desk" data-reveal={120} aria-label="Live desk, illustrative">
                <div className="rl-desk-bar sp-mono">
                  <span>LIVE DESK</span>
                  <span className="rl-live"><i aria-hidden="true" />LIVE</span>
                </div>
                <div className="rl-desk-rows">
                  {DESK.map((r) => (
                    <div key={r.brand} className="rl-desk-row">
                      <span className="rl-desk-brand"><strong>{r.brand}</strong> <span>· {r.note}</span></span>
                      <span className="rl-desk-status" style={{ background: r.bg, color: r.color }}>{r.status}</span>
                    </div>
                  ))}
                </div>
                <p className="sp-mono rl-desk-note">Illustrative entries</p>
              </div>
            </div>

            <ol className="rl-tl" data-tl="">
              <li className="rl-tl-line" aria-hidden="true"><i data-tlfill="" /></li>
              {STEPS.map((st) => (
                <li key={st.t} className="rl-step" data-tlstep="" style={cv(st.color)}>
                  <span className="rl-step-num">{st.num}</span>
                  <div className="rl-step-body">
                    <div className="rl-step-head">
                      <h3>{st.t}</h3>
                      <span className="rl-step-who">{st.who}</span>
                      <span className="sp-mono rl-step-time">{st.time}</span>
                    </div>
                    <p>{st.d}</p>
                    {st.human && <span className="rl-human">● The only manual step</span>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="agents" className="sp-section rl-agents">
            <div className="rl-head">
              <div data-reveal={0}>
                <Eyebrow grad>The agent team</Eyebrow>
                <h2 className="rl-h2 rl-h2--wide">Inside step 04, in order.</h2>
              </div>
              <p className="sp-para" data-reveal={100}>
                Five agents, one after another, turn the prospect’s own product photos into a finished sample deck. Built for faishon.studio.
                Claude runs the loop around them.
              </p>
            </div>
            <div className="rl-pills" data-reveal={120} aria-hidden="true">
              {AGENTS.map((ag, i) => (
                <span key={ag.t} className="rl-pill-wrap">
                  <span className={`rl-pill ${i === act ? 'is-act' : ''}`}>{ag.t}</span>
                  {ag.arrow && <span className="rl-arrow">{ag.arrow}</span>}
                </span>
              ))}
            </div>
            <div className="rl-cards">
              {AGENTS.map((ag, i) => (
                <article
                  key={ag.t}
                  className={`rl-agent ${ag.dark ? 'is-dark' : ''} ${i === act ? 'is-act' : ''}`}
                  data-reveal={ag.delay}
                  style={{ ...cv(ag.color, ag.iconBg), ['--glow' as string]: ag.glow } as CSSProperties}
                >
                  <i className="rl-glow" aria-hidden="true" />
                  <div className="rl-agent-top">
                    <span className="rl-agent-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={ag.icon} /></svg></span>
                    <span className="sp-mono rl-agent-num">{ag.num}</span>
                  </div>
                  <h3>{ag.t}</h3>
                  <p>{ag.d}</p>
                  {ag.shots && (
                    <div className="rl-shots">
                      {ag.shots.map((sh) => (
                        <span key={sh.t} className="rl-shot">
                          <img src={sh.img} alt={sh.t} loading="lazy" decoding="async" />
                          <em className="sp-mono">{sh.t}</em>
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="sp-section rl-made">
            <div className="rl-card" data-reveal={0}>
              <p className="sp-mono rl-kicker">MADE OF</p>
              <h2>The stack behind the loop.</h2>
              <ul className="rl-stack">
                {STACK.map((s) => (
                  <li key={s.t}>
                    <span className="rl-dotc" style={{ background: s.color }} aria-hidden="true" />
                    <span><strong>{s.t}</strong> {s.d && <span className="sp-muted">{s.d}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rl-card rl-card--warm" data-reveal={120}>
              <p className="sp-mono rl-kicker rl-kicker--warm">THE SAME LOOP, OTHER JOBS</p>
              <h2>Built for B2B outreach. The same loop runs internal automation.</h2>
              <div className="rl-jobs">
                {JOBS.map((parts) => (
                  <div key={parts[0]} className="rl-job">
                    {parts.map((t, i) => (
                      <span key={t} className="rl-job-part">
                        <span className={`rl-job-pill ${i === 0 ? 'is-first' : i === parts.length - 1 ? 'is-last' : ''}`}>{t}</span>
                        {i < parts.length - 1 && <span className="rl-arrow-sm" aria-hidden="true">→</span>}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="sp-cta sp-bleed rl-cta">
            <div className="sp-cta-glow" aria-hidden="true" />
            <div className="sp-in sp-cta-in">
              <h2 data-reveal={0}>Four to six weeks from brief to a running loop.</h2>
              <p data-reveal={100}>Outreach, proposals, support tickets, invoices or weekly reporting. Tell us which loop you want closed.</p>
              <div className="sp-actions" data-reveal={180}>
                <a href="#contact" className="btn btn-solid btn-lg">Discuss your automation challenge</a>
                {brochure && <a href={brochure} download className="btn btn-glass btn-lg"><span aria-hidden="true">↓</span> Download the brochure</a>}
              </div>
              <p className="sp-mono rl-cta-note" data-reveal={240}>Delhi · <a href="mailto:rupam@3rdivisuals.com">rupam@3rdivisuals.com</a></p>
            </div>
          </section>

          <Enquire defaultService="Marketing automation & AI enablement" />
        </main>
        <Footer />
      </div>
    </Atmosphere>
  );
}

/* The dot travels the hero circle once every 12s; the stage it passes and that stage's lane cells light up. */
function useLoop(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const dot = el.querySelector<SVGCircleElement>('[data-dot]');
    const arc = el.querySelector<SVGCircleElement>('[data-arc]');
    const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-node]'));
    const lanes = Array.from(el.querySelectorAll<HTMLElement>('[data-lane]'));
    if (!dot || !arc) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const C2 = 2 * Math.PI * 38;
    const PERIOD = 12;
    let last = -1;
    let raf = 0;
    const draw = (p: number) => {
      const ang = -Math.PI / 2 + p * Math.PI * 2;
      dot.setAttribute('cx', (50 + 38 * Math.cos(ang)).toFixed(2));
      dot.setAttribute('cy', (50 + 38 * Math.sin(ang)).toFixed(2));
      arc.setAttribute('stroke-dasharray', `${p * C2} ${C2}`);
      const act = Math.min(5, Math.floor(((p + 1 / 12) % 1) * 6));
      if (act !== last) {
        last = act;
        nodes.forEach((n, i) => n.classList.toggle('is-act', i === act));
        lanes.forEach((c) => c.classList.toggle('is-on', Number(c.dataset.lane) === act));
      }
    };
    if (reduce) { draw(0.02); return; }
    const frame = (t: number) => { draw(((t / 1000) % PERIOD) / PERIOD); raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [root]);
}

/* The timeline's line fills to the middle of the viewport and the step there is highlighted. */
function useTimeline(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tl = el.querySelector<HTMLElement>('[data-tl]');
    const fill = el.querySelector<HTMLElement>('[data-tlfill]');
    const steps = Array.from(el.querySelectorAll<HTMLElement>('[data-tlstep]'));
    if (!tl || !fill) return;
    const on = () => {
      const r = tl.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      fill.style.height = `${Math.min(1, Math.max(0, (mid - r.top) / r.height)) * 100}%`;
      steps.forEach((s) => {
        const b = s.getBoundingClientRect();
        s.classList.toggle('is-act', b.top < mid && b.bottom > mid - 40);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [root]);
}
