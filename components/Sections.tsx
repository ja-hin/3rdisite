'use client';

import { useEffect, useRef, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import { usePathname } from 'next/navigation';
import { ACCENTS, SERVICE_DATA } from '@/lib/services';
import { useAtmosphere } from './Atmosphere';
import { LeadForm } from './Contact';
import { useReveal, useTick } from './services/effects';
import { type CaseSection, WorkflowSection } from './services/Workflow';
import { Showreel } from './Showreel';

/* ---------- E-commerce ---------- */

const path = ['Marketplace listings', 'Amazon PPC', 'D2C websites', 'Meta & Google', 'Content', 'Conversion'];

export function Commerce() {
  const stage = useRef<HTMLDivElement>(null);
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.current?.style.setProperty('--ry', `${x * 16}deg`);
    stage.current?.style.setProperty('--rx', `${-y * 12}deg`);
  };
  const reset = () => { stage.current?.style.setProperty('--ry', '-10deg'); stage.current?.style.setProperty('--rx', '6deg'); };

  return (
    <section className="commerce" data-orb="0 0 0 0.25">
      <div className="commerce-copy">
        <h2>Selling online? We focus on the sale, not just the ad.</h2>
        <p>
          From marketplace listings and Amazon PPC to D2C websites, Meta, Google, content and conversion, we look at
          the complete path from discovery to purchase.
        </p>
        <ol className="journey" aria-label="The path we work on">
          {path.map((p) => <li key={p}>{p}</li>)}
        </ol>
        <a href="#contact" className="btn btn-solid">Grow your online sales</a>
      </div>

      <div className="commerce-stage" onPointerMove={onMove} onPointerLeave={reset}>
        <div className="stack" ref={stage}>
          <div className="plate plate-listing">
            <div className="listing-media">
              <img className="shoe" src="/assets/nike-shoe.png" alt="" decoding="async" />
            </div>
            <div className="listing-info">
              <span className="tag">Bestseller in running</span>
              <strong>Structure Running Shoes</strong>
              <span className="stars" aria-label="4.6 out of 5">★★★★★ <em>4.6</em></span>
              <div className="buy"><b>₹7,732</b><span>Add to cart</span></div>
            </div>
          </div>
          <div className="plate plate-chart">
            <span>Orders, last 90 days</span>
            <svg viewBox="0 0 200 80" aria-hidden="true">
              <path d="M0 70 C30 66 40 58 60 56 S100 44 120 34 S160 18 200 8" className="chart-line" />
              <path d="M0 70 C30 66 40 58 60 56 S100 44 120 34 S160 18 200 8 V80 H0Z" className="chart-fill" />
            </svg>
          </div>
          <div className="plate plate-ad">
            <div className="ad-media"><i className="play" /></div>
            <span>Video ad, 15s</span>
          </div>
        </div>
        <ul className="metrics">
          <li style={{ ['--c' as string]: 'var(--lumen)' }}>More traffic</li>
          <li style={{ ['--c' as string]: 'var(--iris)' }}>Higher conversion</li>
          <li style={{ ['--c' as string]: 'var(--bloom)' }}>Increased sales</li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- Content ---------- */

export function Content() {
  return (
    <section id="work-content" className="content" data-orb="0 0 0 0.5">
      <div className="content-head">
        <h2>Content that works harder for the business.</h2>
        <p>
          Our roots in video and visual communication give us an important advantage: we don&rsquo;t separate growth
          strategy from the content customers actually see.
        </p>
      </div>
      <Showreel />
    </section>
  );
}

/* ---------- Automation ---------- */

const flows = [
  ['Lead comes in', 'Automatically qualify, route and follow up.'],
  ['Customer enquiry arrives', 'Understand, respond and update the CRM.'],
  ['Marketing data sits across platforms', 'Consolidate it and surface what needs attention.'],
];

export function Automation() {
  return (
    <section className="automation" data-orb="0 0 0 0.5">
      <div className="automation-head">
        <h2>Automate what shouldn&rsquo;t need constant human effort.</h2>
        <p>
          We help businesses identify repetitive processes, disconnected workflows and slow manual tasks, and
          simplify them through AI and automation.
        </p>
        <a href="#contact" className="text-link">Explore AI & automation</a>
      </div>
      <div className="flows">
        {flows.map(([a, b], i) => (
          <div className="flow" key={a}>
            <div className="flow-in">{a}</div>
            <svg className="flow-wire" viewBox="0 0 120 20" preserveAspectRatio="none" aria-hidden="true">
              <path id={`w${i}`} d="M0 10 C40 10 40 2 60 10 S80 18 120 10" />
              <circle r="3.2">
                <animateMotion dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite"><mpath href={`#w${i}`} /></animateMotion>
              </circle>
            </svg>
            <div className="flow-out">{b}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- AI products ---------- */

const studio = [
  { t: 'Virtual models', img: '/assets/fashion-a.jpg' },
  { t: 'Product shoots', img: '/assets/fashion-rack.jpg' },
  { t: 'Lifestyle images', img: '/assets/fashion-d.jpg' },
  { t: 'Marketing creatives', img: '/assets/fashion-c.jpg' },
];

export function Products() {
  return (
    <section id="products" className="products" data-orb="0 0 0 0.5">
      <div className="products-copy">
        <h2>We don&rsquo;t only use technology. We build it.</h2>
        <p>
          Our experience solving real business and marketing problems also feeds into products designed around
          repeatable needs.
        </p>
        <a href="https://faishon.studio" className="btn btn-solid" target="_blank" rel="noreferrer">Explore Faishon.Studio</a>
        <p className="products-note">More products in development across marketing, communication and business automation.</p>
      </div>
      <div className="studio">
        <div className="studio-bar">
          <span className="studio-logo">faishon<b>.studio</b></span>
          <span className="studio-tag">AI-powered fashion content creation for brands and sellers</span>
        </div>
        <div className="studio-grid">
          {studio.map((s) => (
            <figure key={s.t} className="shot">
              <img src={s.img} alt={s.t} loading="lazy" decoding="async" />
              <figcaption>{s.t}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Workflow (the AI & automation page's case study, repeated on the home page) ---------- */

const workflow = SERVICE_DATA.automation.find((s): s is CaseSection => s.type === 'case');

export function Workflow() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const tick = useTick(1000);
  if (!workflow) return null;
  const a = ACCENTS.automation;
  const vars = { '--a': a.main, '--a-text': a.text, '--a-rgb': a.rgb } as CSSProperties;
  return (
    <div ref={root}>
      <WorkflowSection s={workflow} tick={tick} className="sp-case--home" style={vars} exploreHref="/services/automation-ai#workflow" />
    </div>
  );
}

/* ---------- Work ---------- */

const work = [
  { t: 'Grow sales', d: 'Marketplace, D2C and performance work', c: 'var(--lumen)' },
  { t: 'Build demand & communication', d: 'Video, content and campaigns', c: 'var(--bloom)' },
  { t: 'Automate & improve', d: 'AI, workflow and automation projects', c: 'var(--iris)' },
];

export function Work() {
  const { fluid } = useAtmosphere();
  const splatAt = (e: RPointerEvent<HTMLElement>) => {
    const x = e.clientX / window.innerWidth, y = 1 - e.clientY / window.innerHeight;
    fluid.current?.splat(x, y, (Math.random() - 0.5) * 900, 600, [0.3, 0.45, 0.95]);
  };
  return (
    <section id="work" className="work" data-orb="0 0 0 0.75">
      <div className="work-head">
        <h2>Work built around business outcomes.</h2>
        <p>Not just a gallery.</p>
        <a href="#contact" className="text-link">Explore our work</a>
      </div>
      <div className="work-list">
        {work.map((w) => (
          <a href="#contact" className="work-item" key={w.t} style={{ ['--c' as string]: w.c }} onPointerEnter={splatAt}>
            <h3>{w.t}</h3>
            <p>{w.d}</p>
            <span className="wi-orb" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Audience ---------- */

const audience = ['E-commerce & D2C brands', 'Marketplace sellers', 'B2B & SaaS companies', 'SMEs & growth businesses', 'Enterprise teams'];

export function Audience() {
  return (
    <section className="audience" data-orb="0.7 0 0.34 0.75" data-orb-m="0 0 0 0">
      <h2>Built for businesses that want growth, not another disconnected agency.</h2>
      <ul className="audience-list">
        {audience.map((a) => <li key={a}><span>{a}</span></li>)}
      </ul>
    </section>
  );
}

/* ---------- Insights ---------- */

const insights = [
  { t: 'How Indian brands can grow on Amazon US', k: 'E-commerce', h: 'b' },
  { t: 'Where AI automation actually saves marketing teams time', k: 'AI & automation', h: 'c' },
  { t: 'Building a B2B outbound engine using email and LinkedIn', k: 'B2B growth', h: 'd' },
];

export function Insights() {
  return (
    <section id="insights" className="insights" data-orb="0 0 0 0">
      <div className="insights-head">
        <h2>Ideas for growing smarter.</h2>
        <a href="#insights" className="text-link">View all insights</a>
      </div>
      <div className="insights-grid">
        {insights.map((p) => (
          <a href="#insights" key={p.t} className={`post post-${p.h}`}>
            <div className="post-art"><i /><i /></div>
            <span className="post-k">{p.k}</span>
            <h3>{p.t}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- CTA + footer ---------- */

export function Cta() {
  const { fluid } = useAtmosphere();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let fired = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired) { fired = true; fluid.current?.burst(6); }
      if (!e.isIntersecting) fired = false;
    }, { threshold: 0.45 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [fluid]);
  return (
    <section id="contact" ref={ref} className="cta" data-orb="0 0.27 0.5 0.2" data-orb-m="0 0.24 0.5 0.2" data-orb-rel="">
      <h2>What is slowing your growth?</h2>
      <p>Tell us where you&rsquo;re trying to grow, sell or improve. We&rsquo;ll start with the business problem and work backwards to the right solution.</p>
      <a href="#enquire" className="btn btn-solid btn-lg" onMouseEnter={() => fluid.current?.burst(3)}>Talk to us</a>
      <span className="cta-note">No predefined package. Start with the problem.</span>
    </section>
  );
}

export function Enquire({ defaultService }: { defaultService?: string } = {}) {
  return (
    <section id="enquire" className="enquire" data-orb="0 0 0 0.2">
      <div className="enquire-copy">
        <p className="kicker">Contact us</p>
        <h2>Start with the problem, not a package.</h2>
        <p className="enquire-lead">Share a few details and we&rsquo;ll come back with a first read on where to begin, before any proposal or retainer.</p>
        <ul className="cta-points">
          <li>Reply within one working day</li>
          <li>A first read on where to start, free</li>
          <li>No retainer or package until it makes sense</li>
        </ul>
        <div className="cta-direct">
          <span>Prefer email?</span>
          <a href="mailto:rupam@3rdivisuals.com">hello@3rdivisuals.com</a>
        </div>
      </div>
      <LeadForm defaultService={defaultService} />
    </section>
  );
}

export function Footer() {
  // on the home page the company links glide in-page; elsewhere they go back home
  const home = usePathname() === '/';
  const at = (hash: string) => (home ? hash : `/${hash}`);
  return (
    <footer className="footer" data-orb="0 0 0 0">
      <div className="footer-brand">
        <strong>3rd i Visuals</strong>
        <p>Growth, technology and owned IP. Strategy and execution for businesses that want to acquire customers, grow sales and market smarter.</p>
      </div>
      <nav aria-label="Services">
        <h4>Services</h4>
        <a href="/services/content-creative">Content & creative</a>
        <a href="/services/ecommerce-growth">E-commerce growth</a>
        <a href="/services/automation-ai">AI & automation</a>
        <a href="/services/b2b-lead-generation">B2B lead generation</a>
      </nav>
      <nav aria-label="Company">
        <h4>Company</h4>
        <a href={at('#work')}>Work</a>
        <a href={at('#products')}>AI products</a>
        <a href={at('#insights')}>Insights</a>
        <a href="#enquire">Contact</a>
      </nav>
      <p className="footer-base">© {new Date().getFullYear()} 3rd i Visuals, 3rdivisuals.com</p>
    </footer>
  );
}
