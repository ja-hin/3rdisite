import { NextResponse } from 'next/server';

/*
 * Lead intake. Accepts the contact form, validates it, then forwards it to
 * whichever destinations are configured through environment variables:
 *   LEAD_WEBHOOK_URL   any JSON webhook (Zapier, Make, n8n, Google Sheets, your CRM)
 *   RESEND_API_KEY     email the lead through resend.com
 *   LEAD_TO_EMAIL      inbox that receives the email (required with RESEND_API_KEY)
 *   LEAD_FROM_EMAIL    verified sender for Resend (defaults to leads@3rdivisuals.com)
 * With nothing configured the lead is logged to the server console so local
 * development still works end to end.
 */
export const runtime = 'nodejs';

type Lead = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const services = new Set([
  'Content, creative & communication',
  'E-commerce & digital sales growth',
  'Marketing automation & AI enablement',
  'B2B lead generation & sales outreach',
  'Not sure yet',
]);

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// small in-memory rate limit: 6 submissions per IP per 10 minutes
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // honeypot: real people never fill this field
  if (clean(body.website, 10)) return NextResponse.json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });

  const lead: Lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 160).toLowerCase(),
    company: clean(body.company, 160),
    phone: clean(body.phone, 40),
    service: clean(body.service, 80),
    message: clean(body.message, 3000),
  };

  if (lead.name.length < 2) return NextResponse.json({ ok: false, error: 'Please tell us your name.' }, { status: 422 });
  if (!emailOk(lead.email)) return NextResponse.json({ ok: false, error: 'Please enter a valid work email.' }, { status: 422 });
  if (!services.has(lead.service)) return NextResponse.json({ ok: false, error: 'Please choose what you need help with.' }, { status: 422 });

  const record = {
    ...lead,
    receivedAt: new Date().toISOString(),
    source: req.headers.get('referer') ?? '',
    userAgent: req.headers.get('user-agent') ?? '',
  };

  const deliveries: Promise<Response>[] = [];

  if (process.env.LEAD_WEBHOOK_URL) {
    deliveries.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(record),
      }),
    );
  }

  if (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL) {
    const lines = [`Name: ${lead.name}`, `Email: ${lead.email}`];
    if (lead.company) lines.push(`Company: ${lead.company}`);
    if (lead.phone) lines.push(`Phone: ${lead.phone}`);
    lines.push(`Needs help with: ${lead.service}`, '', lead.message || '(no message)', '', `Received ${record.receivedAt}`);
    if (record.source) lines.push(`From ${record.source}`);
    const text = lines.join('\n');
    deliveries.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL ?? '3rd i Visuals <leads@3rdivisuals.com>',
          to: process.env.LEAD_TO_EMAIL.split(',').map((s) => s.trim()),
          reply_to: lead.email,
          subject: `New lead: ${lead.name}${lead.company ? ` at ${lead.company}` : ''} — ${lead.service}`,
          text,
        }),
      }),
    );
  }

  if (deliveries.length === 0) {
    console.log('[lead] no delivery configured, logging instead:\n', JSON.stringify(record, null, 2));
    return NextResponse.json({ ok: true });
  }

  const results = await Promise.allSettled(deliveries);
  const failed = results.filter((r) => r.status === 'rejected' || !r.value.ok);
  if (failed.length === results.length) {
    console.error('[lead] every delivery failed', failed);
    return NextResponse.json({ ok: false, error: 'We could not send your message. Please email us directly.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
