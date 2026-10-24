'use client';

import { useState, type FormEvent } from 'react';

const options = [
  'Content, creative & communication',
  'E-commerce & digital sales growth',
  'Marketing automation & AI enablement',
  'B2B lead generation & sales outreach',
  'Not sure yet',
];

// Static-export builds have no API route: point this at Formspree, Web3Forms or any
// endpoint that accepts JSON instead.
const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || '/api/lead';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function LeadForm({ defaultService = '' }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) throw new Error(json.error || 'Something went wrong. Please try again.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="lead-card lead-done" role="status">
        <span className="lead-check" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h3>Thanks, we have your message.</h3>
        <p>We will read it properly and reply within one working day with a few first thoughts on where to start.</p>
        <button type="button" className="text-link" onClick={() => setStatus('idle')}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="lead-card" onSubmit={onSubmit} noValidate={false}>
      <div className="lead-head">
        <h3>Tell us about your growth challenge</h3>
        <p>A few details help us come back with something useful rather than a generic pitch.</p>
      </div>

      <div className="lead-grid">
        <label className="field">
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} placeholder="Priya Sharma" />
        </label>
        <label className="field">
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="priya@company.com" />
        </label>
        <label className="field">
          <span>Company <em>optional</em></span>
          <input name="company" type="text" autoComplete="organization" placeholder="Company or brand" />
        </label>
        <label className="field">
          <span>Phone or WhatsApp <em>optional</em></span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+91" />
        </label>
        <label className="field field-wide">
          <span>What do you need help with?</span>
          <div className="select-wrap">
            <select name="service" required defaultValue={defaultService}>
              <option value="" disabled>Choose an area</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </label>
        <label className="field field-wide">
          <span>What are you trying to grow, sell or improve? <em>optional</em></span>
          <textarea name="message" rows={4} placeholder="Where you are today, what you have tried, and what a good outcome looks like." />
        </label>
        {/* honeypot: hidden from people, filled by bots */}
        <label className="hp" aria-hidden="true">
          Website <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === 'error' && <p className="lead-error" role="alert">{error}</p>}

      <div className="lead-foot">
        <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <span className="lead-note">No predefined package. We start with the problem.</span>
      </div>
    </form>
  );
}
