/* Content of the OneStory page at /insights/onestory. */

export const ONESTORY_DIR = '/assets/onestory';
/* Files the page looks for in public/assets/onestory; each one is optional and has a built-in fallback. */
export const ONESTORY_FILES = [
  'logo.png', 'icon.png', 'vdofy-hub.png', 'vdofy-linkedin.png', 'vdofy-reel-a.png', 'vdofy-reel-b.png', 'vdofy-youtube.png',
  'linkedin.png', 'instagram.png', 'facebook.png', 'youtube.png', 'x.png', 'pinterest.png', 'OneStory-brochure.pdf',
] as const;
export type OneStoryFile = (typeof ONESTORY_FILES)[number];
export type OneStoryAssets = Partial<Record<OneStoryFile, string>>;

export type Tone = { color: string; ink: string; bg: string };
export const HUMAN: Tone = { color: '#ec4b9b', ink: '#c8307f', bg: '#fdeef5' };
export const AI: Tone = { color: '#1f6ff5', ink: '#1f6ff5', bg: '#eaf2fe' };
export const PLAT: Tone = { color: '#f5c400', ink: '#8a6100', bg: '#fff7d6' };

export type ChannelId = 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'x' | 'pinterest';
export type Channel = { id: ChannelId; t: string; color: string; icon: `${ChannelId}.png`; cx: number; cy: number };
/* Six channels around the hero orbit, clockwise from the top. */
export const CHANNELS: Channel[] = (
  [
    ['linkedin', 'LinkedIn', '#0a66c2'], ['instagram', 'Instagram', '#e1306c'], ['facebook', 'Facebook', '#1877f2'],
    ['youtube', 'YouTube', '#ff0000'], ['x', 'X', '#0b1735'], ['pinterest', 'Pinterest', '#e60023'],
  ] as [ChannelId, string, string][]
).map(([id, t, color], i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { id, t, color, icon: `${id}.png` as const, cx: +(50 + 40 * Math.cos(a)).toFixed(2), cy: +(50 + 40 * Math.sin(a)).toFixed(2) };
});

export const BENEFITS = [
  { k: 'TIME SAVE', d: 'Your team briefs and approves. OneStory makes everything else.', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2' },
  { k: 'CONSISTENCY', d: 'One brand kit and one master story drive every post and video.', icon: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5' },
  { k: 'FASTER TO GO LIVE', d: 'Every channel version drafted at once. One approval releases all.', icon: 'M13 2L4 14h7l-1 8 9-12h-7z' },
].map((b, i) => ({ ...b, delay: i * 100 }));

export type SimpleStep = { n: string; t: string; who: string; d: string; tone: Tone };
export const SIMPLE: SimpleStep[] = [
  { n: '1', t: 'Brief', who: 'YOU', d: 'Set the goal and the story', tone: HUMAN },
  { n: '2', t: 'Create', who: 'AI', d: 'Every channel version, video included', tone: AI },
  { n: '3', t: 'Approve', who: 'YOU', d: 'One review, one sign-off', tone: HUMAN },
  { n: '4', t: 'Publish & learn', who: 'AI', d: 'Go live, track, improve next round', tone: AI },
];

export type HoodItem = { tag: string; t: string; tone: Tone };
export type Phase = { n: string; t: string; who: string; tone: Tone; items: HoodItem[] };
const it = (tag: string, t: string, tone: Tone): HoodItem => ({ tag, t, tone });
export const PHASES: Phase[] = [
  { n: '1', t: 'Brief', who: 'YOU', tone: HUMAN, items: [it('01 · HUMAN', 'Business brief', HUMAN), it('02 · HUMAN', 'Channel & audience plan', HUMAN)] },
  { n: '2', t: 'Create', who: 'AI', tone: AI, items: [it('03 · AI-ASSISTED', 'Published content audit', AI), it('04 · HUMAN', 'Master story', HUMAN), it('05 · AI-ASSISTED', 'Channel adaptations', AI)] },
  { n: '3', t: 'Approve', who: 'YOU', tone: HUMAN, items: [it('06 · HUMAN', 'Brand & fact review', HUMAN), it('07 · HUMAN', 'Approval', HUMAN)] },
  { n: '4', t: 'Publish & learn', who: 'AI', tone: AI, items: [it('08 · PLATFORM', 'Publishing', PLAT), it('09 · PLATFORM', 'Performance review', PLAT)] },
];

export type Placement = { t: string; img: OneStoryFile; channel: ChannelId; w: string; pad: string; r: string; ir: string; ratio: string; delay: number; bob: string };
export const PLACEMENTS: Placement[] = (
  [
    ['LinkedIn post', 'vdofy-linkedin.png', 'linkedin', 'clamp(200px,20vw,280px)', '8px', '18px', '12px', '4 / 5'],
    ['Instagram Reel', 'vdofy-reel-a.png', 'instagram', 'clamp(150px,13vw,190px)', '7px', '26px', '20px', '9 / 16'],
    ['Facebook Reel', 'vdofy-reel-b.png', 'facebook', 'clamp(150px,13vw,190px)', '7px', '26px', '20px', '9 / 16'],
    ['YouTube Short', 'vdofy-reel-a.png', 'youtube', 'clamp(150px,13vw,190px)', '7px', '26px', '20px', '9 / 16'],
    ['YouTube video', 'vdofy-youtube.png', 'youtube', 'clamp(260px,26vw,380px)', '8px', '18px', '12px', '16 / 9'],
  ] as [string, OneStoryFile, ChannelId, string, string, string, string, string][]
).map(([t, img, channel, w, pad, r, ir, ratio], i) => ({ t, img, channel, w, pad, r, ir, ratio, delay: i * 90, bob: `${(i * 0.7).toFixed(1)}s` }));

export const FOLLOW: { t: string; channel?: ChannelId; href: string }[] = [
  { t: 'LinkedIn', channel: 'linkedin', href: 'https://www.linkedin.com/company/vdofy' },
  { t: 'Facebook', channel: 'facebook', href: 'https://www.facebook.com/vdofy.in' },
  { t: '@vdofy.in', channel: 'instagram', href: 'https://www.instagram.com/vdofy.in' },
  { t: 'YouTube', channel: 'youtube', href: 'https://www.youtube.com/@vdofy' },
  { t: 'vdofy.com', href: 'https://vdofy.com' },
];

export const NEXT = [
  { n: '01', t: 'Free audit', d: 'We review your last 90 days of posts and show where time, consistency and speed can be improved.', color: '#1f6ff5', hi: false },
  { n: '02', t: '30-day pilot', d: '2 priority channels, a fixed fee, and you keep every asset we make.', color: '#8a6100', hi: true },
  { n: '03', t: 'Scale', d: 'Add channels once you’ve seen the results.', color: '#6b4ef0', hi: false },
].map((n, i) => ({ ...n, delay: i * 100 }));
