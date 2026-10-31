import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/*
 * Lead intake. Accepts the contact form, validates it, then forwards it to
 * whichever destinations are configured through environment variables:
 *   LEAD_TO_EMAIL      inbox(es) that receive the lead, comma separated (defaults to rupam@3rdivisuals.com)
 *   LEAD_FROM_EMAIL    sender address shown on the email
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *                      email the lead through any mailbox, e.g. Gmail / Google Workspace with an app password
 *                      (smtp.gmail.com, port 587). No DNS changes needed.
 *   RESEND_API_KEY     email the lead through resend.com instead (needs the sending domain verified there)
 *   LEAD_WEBHOOK_URL   also POST the lead as JSON to a webhook (Zapier, Make, n8n, Google Sheets, your CRM)
 * With nothing configured the lead is logged to the server console and the browser
 * opens a pre-filled mail draft, so local development still works end to end.
 */
export const runtime = 'nodejs';

const DEFAULT_INBOX = 'rupam@3rdivisuals.com';

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

  // every delivery is a promise that rejects when that channel failed
  const deliveries: Promise<unknown>[] = [];
  const inboxes = (process.env.LEAD_TO_EMAIL || DEFAULT_INBOX).split(',').map((s) => s.trim()).filter(Boolean);
  const mailers = mailSenders();

  if (process.env.LEAD_WEBHOOK_URL) {
    deliveries.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(record),
      }).then((res) => { if (!res.ok) throw new Error(`webhook ${res.status}`); }),
    );
  }

  // the lead itself goes to the admin inbox(es); replying to it answers the customer
  const notice = leadEmail(lead, record);
  for (const send of mailers) deliveries.push(send({ to: inboxes, replyTo: `${lead.name} <${lead.email}>`, ...notice }));

  if (deliveries.length === 0) {
    // nothing configured: log it here and let the browser hand the lead to the inbox via a mail draft
    console.log('[lead] no delivery configured, logging instead:\n', JSON.stringify(record, null, 2));
    return NextResponse.json({ ok: true, delivered: false, inbox: inboxes[0] });
  }

  const results = await Promise.allSettled(deliveries);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
  failed.forEach((r) => console.error('[lead] delivery failed:', r.reason instanceof Error ? r.reason.message : r.reason));
  if (failed.length === results.length) {
    return NextResponse.json({ ok: false, error: 'We could not send your message. Please email us directly.' }, { status: 502 });
  }

  // thank the customer from the same mailbox; the lead is already in, so a failure here is only logged
  if (mailers.length) {
    const thanks = thankYouEmail(lead, inboxes[0]);
    await mailers[0]({ to: [lead.email], replyTo: inboxes[0], ...thanks }).catch((err: unknown) =>
      console.error('[lead] thank-you email failed:', err instanceof Error ? err.message : err),
    );
  }
  return NextResponse.json({ ok: true });
}

type Message = { to: string[]; replyTo: string; subject: string; text: string; html: string };
type Sender = (m: Message) => Promise<unknown>;

/* One sender per configured provider (SMTP mailbox, Resend). Each rejects when that provider refused the message. */
function mailSenders(): Sender[] {
  const out: Sender[] = [];
  const smtp = smtpConfig();
  if (smtp) {
    const transport = nodemailer.createTransport(smtp);
    out.push((m) => transport.sendMail({ from: smtpFrom(smtp.auth.user), ...m }));
  }
  if (process.env.RESEND_API_KEY) {
    out.push((m) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || '3rd i Visuals <leads@3rdivisuals.com>',
          to: m.to,
          reply_to: m.replyTo,
          subject: m.subject,
          text: m.text,
          html: m.html,
        }),
      }).then(async (res) => { if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`); }),
    );
  }
  return out;
}

/* SMTP settings from the environment, or null when the mailbox is not configured. Port 465 is implicit TLS; 587 upgrades with STARTTLS. */
function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 587;
  return { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } };
}

/*
 * Mailboxes only send as the account that logged in, so the From address is always SMTP_USER.
 * LEAD_FROM_EMAIL may still supply the display name, e.g. "3rd i Visuals <anything@...>" keeps "3rd i Visuals".
 */
function smtpFrom(user: string) {
  const name = (process.env.LEAD_FROM_EMAIL || '').match(/^\s*"?([^"<]*?)"?\s*</)?.[1]?.trim() || '3rd i Visuals';
  return `${name} <${user}>`;
}

const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/* The lead as an email: a short subject, a plain-text body and a simple HTML table, the same for every provider. */
function leadEmail(lead: Lead, record: Lead & { receivedAt: string; source: string }) {
  const subject = `New lead: ${lead.name}${lead.company ? ` at ${lead.company}` : ''} — ${lead.service}`;
  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Company', lead.company],
    ['Phone', lead.phone],
    ['Needs help with', lead.service],
    ['Sent from page', pageName(record.source)],
  ].filter((r): r is [string, string] => Boolean(r[1]));
  const lines = rows.map(([k, v]) => `${k}: ${v}`);
  lines.push('', lead.message || '(no message)', '', `Received ${record.receivedAt}`);
  if (record.source) lines.push(`Page URL ${record.source}`);
  const html = `<div style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#0b1735">
  <h2 style="margin:0 0 16px;font-size:18px">New lead from the website</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5b6b8c">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`).join('\n    ')}
  </table>
  <p style="margin:18px 0 0;white-space:pre-wrap">${esc(lead.message || '(no message)')}</p>
  <p style="margin:18px 0 0;font-size:13px;color:#5b6b8c">Received ${record.receivedAt}${record.source ? `<br>Page URL ${esc(record.source)}` : ''}<br>Reply to this email to answer ${esc(lead.name)} directly.</p>
</div>`;
  return { subject, text: lines.join('\n'), html };
}

/* "Home page", "Services: automation-ai", ... from the referer URL, so the admin sees which form was used. */
function pageName(url: string) {
  if (!url) return '';
  try {
    const path = new URL(url).pathname.replace(/\/$/, '');
    if (!path) return 'Home page';
    const m = path.match(/^\/services\/([^/]+)$/);
    if (m) return `Services: ${m[1]}`;
    return path === '/services' ? 'Services overview' : path;
  } catch {
    return url;
  }
}

/* The acknowledgement the customer receives straight away. */
function thankYouEmail(lead: Lead, inbox: string) {
  const first = lead.name.split(/\s+/)[0];
  const subject = 'Thank you for contacting 3rd i Visuals';
  const lines = [
    `Hi ${first},`,
    '',
    'Thank you for contacting us. We have received your message and will coordinate with you within one working day.',
    '',
    'What you sent us:',
    `Needs help with: ${lead.service}`,
    lead.message ? `Message: ${lead.message}` : '',
    '',
    `If anything is urgent in the meantime, reply to this email or write to ${inbox}.`,
    '',
    'Warm regards,',
    'Team 3rd i Visuals',
    'https://3rdivisuals.com',
  ].filter((l) => l !== '');
  const html = `<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#0b1735;max-width:560px">
  <p>Hi ${esc(first)},</p>
  <p>Thank you for contacting us. We have received your message and will coordinate with you within <strong>one working day</strong>.</p>
  <div style="margin:20px 0;padding:16px 18px;border-radius:12px;background:#f3f6fc">
    <p style="margin:0 0 6px;font-size:13px;color:#5b6b8c">What you sent us</p>
    <p style="margin:0"><strong>Needs help with:</strong> ${esc(lead.service)}</p>
    ${lead.message ? `<p style="margin:8px 0 0;white-space:pre-wrap">${esc(lead.message)}</p>` : ''}
  </div>
  <p>If anything is urgent in the meantime, reply to this email or write to <a href="mailto:${esc(inbox)}">${esc(inbox)}</a>.</p>
  <p style="margin-top:24px">Warm regards,<br><strong>Team 3rd i Visuals</strong><br><a href="https://3rdivisuals.com" style="color:#1f6ff5">3rdivisuals.com</a></p>
</div>`;
  return { subject, text: lines.join('\n'), html };
}
