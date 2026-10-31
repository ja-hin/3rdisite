import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import RelayPage from '@/components/insights/RelayPage';
import { RELAY_BROCHURE } from '@/lib/relay';
import '../relay.css';

export const metadata: Metadata = {
  title: 'RELAY — closed-loop agentic outreach · 3rd i Visuals',
  description:
    'RELAY: a closed loop between your outreach platform, Claude and a team of AI agents. Reply to sample to link in about 40 minutes, with one human click.',
};

export default function Page() {
  // the brochure buttons appear once public/assets/RELAY-brochure.pdf exists (checked when the page is built)
  const brochure = fs.existsSync(path.join(process.cwd(), 'public', RELAY_BROCHURE)) ? RELAY_BROCHURE : null;
  return <RelayPage brochure={brochure} />;
}
