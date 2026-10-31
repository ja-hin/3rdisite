import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import OneStoryPage from '@/components/insights/OneStoryPage';
import { ONESTORY_DIR, ONESTORY_FILES, type OneStoryAssets } from '@/lib/onestory';
import '../onestory.css';

export const metadata: Metadata = {
  title: 'OneStory — one brief in, every channel live · 3rd i Visuals',
  description:
    'OneStory: Human + Agentic AI social content automation. Faster, on-brand social content and video across every channel, without adding headcount.',
};

export default function Page() {
  // every image and the brochure are optional: whatever exists in public/assets/onestory at build time is used, the rest falls back
  const assets: OneStoryAssets = {};
  for (const f of ONESTORY_FILES) {
    if (fs.existsSync(path.join(process.cwd(), 'public', ONESTORY_DIR, f))) assets[f] = `${ONESTORY_DIR}/${f}`;
  }
  return <OneStoryPage assets={assets} />;
}
