'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Atmosphere from '@/components/Atmosphere';
import { Enquire, Footer } from '@/components/Sections';
import { SERVICE_PAGES, pageByKey } from '@/lib/services';
import { SiteNav } from './SiteNav';
import { stepState, useAutoplay, useReveal, useTick } from './effects';

const vars = { '--a': '#1f6ff5', '--a-soft': '#eef3fd', '--a-text': '#1f6ff5', '--a-light': '#8db4ff', '--a-rgb': '31,111,245', '--c': '#1f6ff5' } as CSSProperties;

const problems = [
  { q: 'Your ads are generating traffic, but sales are weak.', lead: 'It may be a', strong: 'conversion, content or customer-journey problem.', caps: [0, 1] },
  { q: 'Your marketplace listings get views, but don’t convert.', lead: 'It may require', strong: 'better product content + pricing + optimisation.', caps: [0, 1] },
  { q: 'Your outbound gets replies, but opportunities are being lost.', lead: 'It may require', strong: 'CRM + follow-up automation.', caps: [2, 3] },
  { q: 'Your team is producing content constantly, but performance is inconsistent.', lead: 'It may require', strong: 'strategy + data + a better content system.', caps: [0, 2] },
];
const caps = [
  { name: 'Content & Creative', color: '#8f7af5' },
  { name: 'E-commerce Growth', color: '#4e93ff' },
  { name: 'AI & Automation', color: '#f0962b' },
  { name: 'B2B Lead Generation', color: '#ec4b9b' },
];
const outbound = ['ICP', 'Data', 'Messaging', 'Cold Email', 'LinkedIn', 'Follow-up', 'Qualified Meetings', 'CRM'];
const ecFlow = ['Traffic', 'Conversion', 'Order', 'Repeat customer'];
const howSteps = [
  { t: 'Understand', d: 'Business objectives, customers and current bottlenecks.', c: '#6b4ef0' },
  { t: 'Prioritise', d: 'Identify what is most likely to improve growth or efficiency.', c: '#4f63f2' },
  { t: 'Build', d: 'Bring in the right strategy, creative, growth or automation capabilities.', c: '#1f7cf5' },
  { t: 'Execute', d: 'Run the work across the relevant channels.', c: '#ec4b9b' },
  { t: 'Measure & Improve', d: 'Track what matters and continuously improve.', c: '#d97f16' },
];
const engage = [
  { t: 'Focused Project', d: 'A clearly defined requirement such as a video campaign, marketplace launch, website, automation workflow or outbound setup.', dots: ['#1f7cf5'] },
  { t: 'Managed Service', d: 'Ongoing ownership of an area such as content, marketplace growth, performance marketing or B2B outreach.', dots: ['#1f7cf5', '#6b4ef0'] },
  { t: 'Integrated Growth Partner', d: 'Multiple capabilities working together around a broader customer acquisition, sales or transformation objective.', dots: ['#1f7cf5', '#6b4ef0', '#ec4b9b', '#f0962b'] },
];
const who = [
  { t: 'E-commerce & D2C Brands', d: 'Grow marketplaces and owned digital channels.', c: '#1f7cf5', l: '#9cc4fb' },
  { t: 'Marketplace Sellers', d: 'Build stronger listings, advertising, conversion and operations.', c: '#6b4ef0', l: '#b3a5f7' },
  { t: 'B2B & SaaS Companies', d: 'Create demand and build systematic outbound acquisition.', c: '#ec4b9b', l: '#f6a8cd' },
  { t: 'Growth Businesses & SMEs', d: 'Connect marketing, sales and automation without building large internal teams.', c: '#f0962b', l: '#f7c88f' },
  { t: 'Enterprise Teams', d: 'Bring specialist creative, growth and automation capability into specific initiatives.', c: '#0b1735', l: '#5a6786' },
];
const work = [
  { t: 'Grow Sales', d: 'Marketplace / D2C / performance', c: '#1f7cf5', img: '/assets/shopping-bags.jpg' },
  { t: 'Build Demand', d: 'Content / video / campaigns', c: '#6b4ef0', img: '/assets/video-edit.jpg' },
  { t: 'Automate & Improve', d: 'AI / workflow / automation', c: '#f0962b', img: '/assets/dashboard.jpg' },
];
const nodes = [
  { k: 'Content', v: 'Creative & communication', c: '#6b4ef0', l: '#b3a5f7', pos: 'n' },
  { k: 'Digital Sales', v: 'Marketplace & D2C', c: '#1f7cf5', l: '#9cc4fb', pos: 'e' },
  { k: 'B2B Acquisition', v: 'Lead generation & outreach', c: '#ec4b9b', l: '#f6a8cd', pos: 's' },
  { k: 'Automation', v: 'AI & workflows', c: '#f0962b', l: '#f7c88f', pos: 'w', tc: '#d97f16' },
];

const Pill = ({ children }: { children: React.ReactNode }) => <li className="sx-chip">{children}</li>;

export default function ServicesIndex() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  useAutoplay(root);
  const tick = useTick(850);

  const [active, setActive] = useState(0);
  const picked = useRef(false);
  useEffect(() => {
    const id = setInterval(() => { if (!picked.current) setActive((v) => (v + 1) % problems.length); }, 4200);
    return () => clearInterval(id);
  }, []);
  const pick = (i: number) => { picked.current = true; setActive(i); };
  const cur = problems[active];

  const P = { content: pageByKey('content'), ecommerce: pageByKey('ecommerce'), automation: pageByKey('automation'), b2b: pageByKey('b2b') };
  const obCur = tick % (outbound.length + 2);

  return (
    <Atmosphere>
      <div ref={root} className="sp sx" style={vars}>
        <SiteNav current="/services" />
        <main>
          {/* 1 hero */}
          <section id="top" className="sx-hero" data-orb="0 0 0 0">
            <div className="sx-hero-copy">
              <p className="sp-eyebrow sx-eyebrow"><i aria-hidden="true" />Growth &amp; marketing services</p>
              <h1 className="sx-title" aria-label="Different growth problems. One connected ecosystem.">
                {['Different growth', 'problems.', 'One connected', 'ecosystem.'].map((l, i) => (
                  <span className="line" key={l} aria-hidden="true">
                    <span className={i >= 2 ? 'grad' : ''} style={{ animationDelay: `${0.15 + i * 0.11}s${i >= 2 ? ', 1.4s' : ''}` }}>{l}</span>
                  </span>
                ))}
              </h1>
              <p className="sp-para sx-lead" data-reveal={500}>Your content, digital sales, customer acquisition and marketing operations should not work in isolation.</p>
              <p className="sx-lead sx-lead--strong" data-reveal={600}>3rd i Visuals brings strategy, creative, growth marketing, sales outreach and AI-enabled automation together, helping businesses build a more connected path from attention to customer acquisition and growth.</p>
              <div className="sp-actions" data-reveal={700}>
                <a href="#contact" className="btn btn-solid">Discuss Your Growth Challenge</a>
                <a href="#services" className="btn btn-ghost">Explore Our Services <span>↓</span></a>
              </div>
            </div>

            <div className="sx-ring" data-reveal={300} aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(11,23,53,.17)" strokeWidth=".3" strokeDasharray="1 1.4" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(31,111,245,.18)" strokeWidth=".25" />
                <line x1="50" y1="50" x2="50" y2="14" stroke="rgba(107,78,240,.35)" strokeWidth=".3" />
                <line x1="50" y1="50" x2="86" y2="50" stroke="rgba(31,124,245,.35)" strokeWidth=".3" />
                <line x1="50" y1="50" x2="50" y2="86" stroke="rgba(236,75,155,.35)" strokeWidth=".3" />
                <line x1="50" y1="50" x2="14" y2="50" stroke="rgba(240,150,43,.4)" strokeWidth=".3" />
                <g className="sx-orbit sx-orbit-a"><circle cx="86" cy="50" r="1.3" fill="#1f6ff5" /></g>
                <g className="sx-orbit sx-orbit-b"><circle cx="26" cy="50" r=".9" fill="#ec4b9b" /></g>
              </svg>
              <div className="sx-core"><span>Business &amp; customer growth</span></div>
              {nodes.map((n, i) => (
                <div key={n.k} className={`sx-node sx-node-${n.pos} bob`} style={{ ['--i' as string]: i, ['--c' as string]: n.c, ['--l' as string]: n.l }}>
                  <span className="sx-node-dot" />
                  <span>
                    <strong style={{ color: n.tc ?? n.c }}>{n.k}</strong>
                    <em>{n.v}</em>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2 proposition */}
          <section id="services" className="sx-prop" data-orb="-0.74 -0.45 0.36 0.25" data-orb-m="0 0 0 0">
            <div data-reveal={0}>
              <h2>One partner. Four ways to grow.</h2>
              <p className="sx-prop-sub">Different businesses come to us with different problems.</p>
            </div>
            <div className="sx-prop-body" data-reveal={120}>
              <ul className="sx-list">
                <li><span style={{ background: '#6b4ef0' }} />Some need stronger content and communication.</li>
                <li><span style={{ background: '#1f7cf5' }} />Some need to grow marketplace or D2C sales.</li>
                <li><span style={{ background: '#ec4b9b' }} />Some need a predictable B2B pipeline.</li>
                <li><span style={{ background: '#f0962b' }} />Others need to remove repetitive work and connect their marketing and sales processes.</li>
              </ul>
              <p className="sp-hl">We start with the problem, not a predefined package.</p>
            </div>
          </section>

          {/* 3 service cards */}
          <section className="sx-cards">
            <article id="content" className="sx-card" style={{ ['--c' as string]: '#6b4ef0', ['--c-rgb' as string]: '107,78,240' }} data-reveal={0}>
              <div className="sp-card-glow sp-card-glow--lg" aria-hidden="true" />
              <header className="sx-card-head"><span>01</span><small>Content, Creative &amp; Communication</small></header>
              <div className="sx-art sx-art-tiles" aria-hidden="true">
                {[
                  ['Video production', '/assets/camera.jpg'],
                  ['Product visual', '/assets/product-headphones.jpg'],
                  ['Social creative', '/assets/social-phone.jpg'],
                ].map(([t, src]) => (
                  <div key={t} className="sx-tile"><img src={src} alt="" loading="lazy" decoding="async" /><span className="sx-tile-tag">{t}</span></div>
                ))}
              </div>
              <h3>Turn ideas into communication that moves customers.</h3>
              <p className="sp-para">We build content and creative systems that help brands get noticed, explain what they offer and communicate consistently across customer touchpoints.</p>
              <div>
                <h4 className="sx-k">What we do</h4>
                <ul className="sx-chips">
                  {['Content Strategy', 'Social Media Content', 'Brand Communication', 'Video Production', 'AI Video', '3D & CGI', 'Product Content', 'Performance Creatives', 'Campaign Creative', 'Email & WhatsApp Communication'].map((c) => <Pill key={c}>{c}</Pill>)}
                </ul>
              </div>
              <p className="sx-best"><strong>Best suited for:</strong> Brands that need stronger communication, more consistent content or high-quality creative production at scale.</p>
              <a href={P.content.href} className="sp-link">Explore Content, Creative &amp; Communication →</a>
            </article>

            <article id="ecommerce" className="sx-card" style={{ ['--c' as string]: '#1f7cf5', ['--c-rgb' as string]: '31,124,245' }} data-reveal={120}>
              <div className="sp-card-glow sp-card-glow--lg" aria-hidden="true" />
              <header className="sx-card-head"><span>02</span><small>E-commerce &amp; Digital Sales Growth</small></header>
              <div className="sx-art sx-art-ec" aria-hidden="true">
                <div className="sx-ec-src"><div>Marketplace</div><div>D2C storefront</div></div>
                <ol className="sx-ec-flow">
                  {ecFlow.map((f, i) => <li key={f} className={tick % (ecFlow.length + 1) === i ? 'is-act' : ''}><span />{f}</li>)}
                </ol>
              </div>
              <h3>Turn digital channels into stronger sales channels.</h3>
              <p className="sp-para">We help businesses grow across marketplaces and their own D2C channels by connecting visibility, content, advertising, conversion and ongoing sales optimisation.</p>
              <div className="sx-two">
                <div><h4 className="sx-k">Marketplace Growth</h4><p>Marketplace Management • Amazon US &amp; UK • Amazon India • Listings &amp; Catalogue • Marketplace SEO • Amazon PPC • Promotions • Pricing • Reviews &amp; Account Health • Analytics</p></div>
                <div><h4 className="sx-k">D2C Growth</h4><p>E-commerce Websites • Shopify / WooCommerce • Google &amp; Meta Ads • SEO • AEO / AI Search Optimisation • CRO • Retargeting • Email &amp; WhatsApp • Analytics</p></div>
              </div>
              <p className="sx-best"><strong>Best suited for:</strong> Brands and sellers looking to increase online sales rather than manage advertising, marketplaces and websites as separate activities.</p>
              <a href={P.ecommerce.href} className="sp-link">Explore E-commerce &amp; Digital Sales Growth →</a>
            </article>

            <article id="automation" className="sx-card" style={{ ['--c' as string]: '#d97f16', ['--c-rgb' as string]: '240,150,43' }} data-reveal={0}>
              <div className="sp-card-glow sp-card-glow--lg" aria-hidden="true" />
              <header className="sx-card-head"><span>03</span><small>Marketing Automation &amp; AI Enablement</small></header>
              <div className="sx-art sx-art-auto" aria-hidden="true">
                <div className="sx-auto-box"><span className="sp-mono">BEFORE</span><strong>Manual, repetitive tasks</strong></div>
                <span className="sx-wire" />
                <div className="sx-auto-box is-hot"><span className="sp-mono">AUTOMATED WORKFLOW</span><strong>CRM, routing, AI agents</strong></div>
                <span className="sx-wire" />
                <div className="sx-auto-box"><span className="sp-mono">OUTCOME</span><strong>Measurable operational improvement</strong></div>
              </div>
              <h3>Make marketing and sales work smarter.</h3>
              <p className="sp-para">We identify repetitive processes, disconnected workflows and manual tasks that slow teams down, then use automation and AI where they can create a measurable operational improvement.</p>
              <div>
                <h4 className="sx-k">What we automate</h4>
                <ul className="sx-chips">
                  {['CRM Workflows', 'Lead Capture & Routing', 'AI Agents', 'Lead Qualification', 'Email Automation', 'WhatsApp Automation', 'Marketing Workflows', 'Dashboards & Reporting', 'Content Workflows', 'Custom AI Solutions'].map((c) => <Pill key={c}>{c}</Pill>)}
                </ul>
              </div>
              <div className="sx-note">
                <p><strong>Problem first. Technology second.</strong></p>
                <p>We don&rsquo;t begin by selling an AI tool. We first understand what is taking too much time, where information is getting lost and which processes are difficult to scale.</p>
              </div>
              <p className="sx-best"><strong>Best suited for:</strong> Businesses that have outgrown manual processes or want to improve marketing and sales productivity without simply adding more people.</p>
              <a href={P.automation.href} className="sp-link">Explore Marketing Automation &amp; AI →</a>
            </article>

            <article id="b2b" className="sx-card" style={{ ['--c' as string]: '#ec4b9b', ['--c-rgb' as string]: '236,75,155' }} data-reveal={120}>
              <div className="sp-card-glow sp-card-glow--lg" aria-hidden="true" />
              <header className="sx-card-head"><span>04</span><small>B2B Lead Generation &amp; Sales Outreach</small></header>
              <div className="sx-art sx-art-ob" aria-hidden="true">
                <span className="sp-mono sx-ob-k">THE OUTBOUND ENGINE</span>
                <ol className="sx-ob">
                  {outbound.map((o, i) => (
                    <li key={o}>
                      <span className={`sx-ob-chip ${stepState(tick, outbound.length, i)}`}>{o}</span>
                      {i < outbound.length - 1 && <span className="sx-ob-arrow">→</span>}
                    </li>
                  ))}
                </ol>
                <div className="sx-ob-bar"><i style={{ width: `${Math.min(100, ((obCur + 1) / outbound.length) * 100)}%` }} /></div>
              </div>
              <h3>Build a more systematic route to new B2B customers.</h3>
              <p className="sp-para">We help businesses identify the right prospects, reach the right decision-makers and build structured outbound programmes designed to generate qualified sales conversations.</p>
              <div>
                <h4 className="sx-k">Services include</h4>
                <ul className="sx-chips">
                  {['ICP Definition', 'Prospect Database Building', 'Data Enrichment', 'Cold Email Outreach', 'LinkedIn Outreach', 'Appointment Setting', 'Follow-up Workflows', 'CRM & Lead Management', 'Inside Sales Support'].map((c) => <Pill key={c}>{c}</Pill>)}
                </ul>
              </div>
              <p className="sx-best"><strong>Best suited for:</strong> B2B companies, SaaS businesses and service businesses that need a more consistent new-business pipeline.</p>
              <a href={P.b2b.href} className="sp-link">Explore B2B Lead Generation →</a>
            </article>
          </section>

          {/* 4 ecosystem advantage */}
          <section className="sp-eco sp-bleed">
            <div className="sp-eco-glow sx-eco-glow" aria-hidden="true" />
            <div className="sp-in">
              <p className="sp-eyebrow sp-eyebrow--light" data-reveal={0}><i aria-hidden="true" />The ecosystem advantage</p>
              <h2 data-reveal={80}>Because the real problem rarely belongs to just one channel.</h2>
              <div className="sx-eco" data-reveal={160}>
                <div className="sx-problems">
                  {problems.map((p, i) => (
                    <button key={p.q} type="button" className={i === active ? 'is-act' : ''} onClick={() => pick(i)} onMouseEnter={() => pick(i)} aria-pressed={i === active}>
                      <span className="sp-mono">0{i + 1}</span>
                      <span>{p.q}</span>
                    </button>
                  ))}
                </div>
                <div className="sx-diag">
                  <div>
                    <span className="sp-mono sx-diag-k">→ DIAGNOSIS</span>
                    <p className="sx-diag-p">{cur.lead} <strong>{cur.strong}</strong></p>
                  </div>
                  <div>
                    <span className="sp-mono sx-diag-k">CAPABILITIES ACTIVATED</span>
                    <div className="sx-caps">
                      {caps.map((c, i) => {
                        const on = cur.caps.includes(i);
                        return (
                          <span key={c.name} className={on ? 'is-on' : ''} style={{ ['--c' as string]: c.color }}>
                            <i />{c.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="sp-eco-close sx-eco-close" data-reveal={0}>
                One business problem can activate several capabilities <span>without creating several agency relationships.</span>
              </h3>
            </div>
          </section>

          {/* 5 how we work */}
          <section id="how" className="sp-how" data-orb="0.84 0.55 0.28 0.5" data-orb-m="0 0 0 0">
            <p className="sp-eyebrow" data-reveal={0}><i aria-hidden="true" />How we work</p>
            <h2 data-reveal={80}>Start with the business. Build around the problem.</h2>
            <div className="sp-rail sx-rail" data-reveal={160}>
              <div className="sp-rail-line sx-rail-line" aria-hidden="true"><i data-fill="" /></div>
              <ol className="sp-rail-steps">
                {howSteps.map((st, i) => (
                  <li key={st.t} style={{ ['--c' as string]: st.c }}>
                    <span className="sp-rail-badge">0{i + 1}</span>
                    <h3>{st.t}</h3>
                    <p>{st.d}</p>
                  </li>
                ))}
              </ol>
            </div>
            <blockquote className="sx-quote" data-reveal={0}>You don&rsquo;t need to buy the entire ecosystem. We use the capabilities your business actually needs.</blockquote>
          </section>

          {/* 6 ways to engage */}
          <section className="sp-section sp-three">
            <div className="sp-three-head">
              <h2 data-reveal={0}>Work with us in the way that fits the problem.</h2>
              <a href="#contact" className="btn btn-dark" data-reveal={80}>Talk to Us About Your Requirement</a>
            </div>
            <div className="sp-three-grid">
              {engage.map((e, i) => (
                <article key={e.t} className={`sp-three-card ${i === 2 ? 'is-featured sx-featured' : ''}`} data-reveal={i * 100}>
                  <div className="sp-dots" aria-hidden="true">{e.dots.map((d) => <span key={d} style={{ background: d }} />)}</div>
                  <h3>{e.t}</h3>
                  <p>{e.d}</p>
                </article>
              ))}
            </div>
          </section>

          {/* 7 AI */}
          <section id="ai" className="sp-section sx-ai">
            <div data-reveal={0}>
              <h2>AI is part of how we work, not a separate layer of jargon.</h2>
              <p className="sp-para">We use AI and automation across research, content workflows, customer acquisition, lead management, reporting and repetitive marketing operations where it can genuinely improve speed, consistency or scale.</p>
              <p className="sp-para">And because <strong>3rd i Visuals also builds its own AI products</strong>, our understanding comes from applying technology to real business problems, not simply recommending tools.</p>
            </div>
            <a href="https://faishon.studio" target="_blank" rel="noreferrer" className="sx-studio" data-reveal={120}>
              <span className="sp-strip-logo">faishon<b>.studio</b></span>
              <div className="sx-studio-vid" aria-hidden="true"><video data-autoplay="" src="/assets/video-network.mp4" autoPlay muted loop playsInline preload="metadata" /></div>
              <div className="sx-studio-foot">
                <span>We build technology too.</span>
                <span className="sp-link">Explore our AI Products →</span>
              </div>
            </a>
          </section>

          {/* 8 who */}
          <section className="sp-section sx-who">
            <h2 data-reveal={0}>Built for businesses where growth crosses multiple channels.</h2>
            <div className="sx-who-grid">
              {who.map((w, i) => (
                <div key={w.t} className="sx-who-card" data-reveal={i * 70} style={{ ['--c' as string]: w.c, ['--l' as string]: w.l }}>
                  <span className="sx-who-dot" aria-hidden="true" />
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9 work */}
          <section id="work" className="sp-section sp-work">
            <div className="sp-work-head">
              <h2 data-reveal={0}>See the ecosystem in action.</h2>
              <a href="/#work" className="sp-link" data-reveal={80}>Explore Our Work →</a>
            </div>
            <div className="sp-work-grid">
              {work.map((w, i) => (
                <article key={w.t} className="sp-work-card" data-reveal={i * 100} style={{ ['--c' as string]: w.c }}>
                  <div className="sp-work-ph"><img src={w.img} alt="" loading="lazy" decoding="async" /><span className="sp-work-tag sp-mono">sample image</span></div>
                  <div className="sp-work-body">
                    <div><span className="sp-work-cat">{w.t}</span><p className="sx-work-sub">{w.d}</p></div>
                    <dl className="sp-work-dl">
                      {['Problem', 'Solution', 'Outcome'].map((r) => <div key={r}><dt>{r}</dt><dd>—</dd></div>)}
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 10 CTA */}
          <section className="sp-cta sp-bleed">
            <div className="sp-cta-glow" aria-hidden="true" />
            <div className="sp-in sp-cta-in">
              <h2 className="sx-cta-h2" data-reveal={0}>What is getting in the way of your growth?</h2>
              <p data-reveal={100}>You don&rsquo;t need to decide which 3rd i Visuals service you need.</p>
              <p className="sx-cta-p2" data-reveal={160}>Tell us what you&rsquo;re trying to achieve, where you&rsquo;re getting stuck and what you&rsquo;re already doing. <strong>We&rsquo;ll start with the problem and identify the right way forward.</strong></p>
              <a href="#contact" className="btn btn-solid btn-lg" data-reveal={220}>Discuss Your Growth Challenge</a>
              <nav className="sp-cta-others" aria-label="Service pages" data-reveal={280}>
                <span>Or explore:</span>
                {SERVICE_PAGES.map((p) => <a key={p.key} href={p.href}>{p.name}</a>)}
              </nav>
            </div>
          </section>

          <Enquire />
        </main>
        <Footer />
      </div>
    </Atmosphere>
  );
}
