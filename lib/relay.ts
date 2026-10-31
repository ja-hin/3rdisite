/* Content of the RELAY case study at /insights/agentic-ai-relay. */

export const RELAY_BROCHURE = '/assets/RELAY-brochure.pdf';

const C = { send: '#6b4ef0', reply: '#1f7cf5', orch: '#1f6ff5', make: '#f0962b', approve: '#ec4b9b', deliver: '#12a26b' };
const SOFT: Record<string, string> = {
  '#6b4ef0': '#f1eefd', '#1f7cf5': '#eaf2fe', '#1f6ff5': '#eaf2fe', '#f0962b': '#fdf4ea', '#ec4b9b': '#fdeef5', '#12a26b': '#e7f7ef',
};
const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/* The six stages of the loop, placed clockwise around the hero circle starting at the top. */
export type LoopNode = { t: string; d: string; color: string; bg: string; num: string; x: string; y: string };
const POS = [['50%', '12%'], ['83%', '31%'], ['83%', '69%'], ['50%', '88%'], ['17%', '69%'], ['17%', '31%']];
export const LOOP: LoopNode[] = (
  [
    ['SEND', 'Smartlead', C.send],
    ['REPLY', 'the prospect', C.reply],
    ['ORCHESTRATE', 'Claude', C.orch],
    ['MAKE', 'agent team on a VPS', C.make],
    ['APPROVE', 'one person, one click', C.approve],
    ['DELIVER', 'Claude → Smartlead', C.deliver],
  ] as [string, string, string][]
).map(([t, d, color], i) => ({ t, d, color, bg: SOFT[color], num: `0${i + 1}`, x: POS[i][0], y: POS[i][1] }));

/* Which platform is active at which stage (column index into LOOP). */
export type Lane = { name: string; on: number[]; color: string };
export const LANES: Lane[] = [
  { name: 'SMARTLEAD', on: [0, 5], color: '#8f7af5' },
  { name: 'PROSPECT', on: [1], color: '#4e93ff' },
  { name: 'CLAUDE', on: [2, 5], color: '#3b8cff' },
  { name: 'AGENT TEAM', on: [3], color: '#f0962b' },
  { name: 'HUMAN', on: [4], color: '#ec4b9b' },
];

export type Step = { t: string; who: string; time: string; d: string; color: string; human: boolean; num: string };
export const STEPS: Step[] = (
  [
    ['SEND', 'Smartlead', '16:56 IST', 'A four-step sequence, A/B tested, plain text, from warmed mailboxes. Five new prospects a day per campaign.', C.send],
    ['LISTEN', 'Claude, every 2 hours', '17:05', 'Claude reads new replies and sorts them: yes, question, not now, auto-reply. Only a yes moves on.', C.reply],
    ['HAND OFF', 'Claude → agent API', '17:06', 'The prospect’s name, website and words go to the agent team. Claude thanks them in the same thread and pauses the sequence.', C.orch],
    ['MAKE', 'agent team on a VPS', '17:06 – 17:40', 'Five agents, one after another, turn the prospect’s own product photos into a finished sample deck.', C.make],
    ['APPROVE', 'one person', '17:42', 'The deck waits on a dashboard. You look, edit the reply if you like, click Approve.', C.approve, true],
    ['DELIVER', 'Claude → Smartlead', '17:45', 'Claude takes the approved reply and sends it in the original email thread, with a tracked link to the deck.', C.deliver],
    ['TRACK', 'live desk + alerts', 'always', 'A live page lists every reply, every deck and its status, and whether the prospect opened the link. A push alert on your phone the moment someone says yes.', '#5b3fe0'],
  ] as [string, string, string, string, string, boolean?][]
).map(([t, who, time, d, color, human], i) => ({ t, who, time, d, color, human: !!human, num: `0${i + 1}` }));

const ICON = {
  scout: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM16 16l4.5 4.5',
  judge: 'M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12zM12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z',
  producer: 'M4 7.5h3l1.6-2.2h6.8L17 7.5h3v11H4zM12 10a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z',
  qa: 'M12 3l7.5 3v5.5c0 4.4-3.1 8-7.5 9.5-4.4-1.5-7.5-5.1-7.5-9.5V6zM8.8 12l2.2 2.2 4.2-4.4',
  deck: 'M4 4.5h16v11H4zM12 15.5v4M8 19.5h8M7.5 12l3-3 2.5 2 3.5-3.5',
  claude: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8',
};

export type Agent = {
  t: string; d: string; color: string; icon: string; num: string; delay: number; arrow: string;
  dark: boolean; iconBg: string; glow: string; shots?: { t: string; img: string }[];
};
const SHOTS = [
  { t: 'front', img: '/assets/fashion-a.jpg' },
  { t: 'back', img: '/assets/fashion-c.jpg' },
  { t: 'detail', img: '/assets/fashion-rack.jpg' },
  { t: 'editorial', img: '/assets/fashion-d.jpg' },
];
export const AGENTS: Agent[] = (
  [
    ['SCOUT', 'Reads the prospect’s site: product feed, sitemap or pages. Finds every product and its photos.', '#1f7cf5', ICON.scout],
    ['JUDGE', 'A vision model picks the three products that will show the biggest before-and-after, works out the brand’s look, who wears what, and a location per product.', '#6b4ef0', ICON.judge],
    ['PRODUCER', 'Renders 8 images per product on the image engine: a studio set (front, back, three-quarter, detail) and an editorial set at one location, same model throughout.', '#ec4b9b', ICON.producer],
    ['QA', 'Checks every image against the original photo: print, colour, fit, footwear, model. Anything that drifts is remade.', '#12a26b', ICON.qa],
    ['DECK', 'Lays the results into a branded PDF, hosts it at a tracked link, and counts who opens it.', '#f0962b', ICON.deck],
    ['CLAUDE', 'Runs the loop: classifies replies, hands off, writes to the prospect, watches for your approval, keeps the live desk current. Cloud routines do this every two hours with the laptop off.', '#8db4ff', ICON.claude],
  ] as [string, string, string, string][]
).map(([t, d, color, icon], i, arr) => {
  const dark = t === 'CLAUDE';
  return {
    t, d, color, icon, dark,
    num: dark ? 'ORCHESTRATOR' : `04.${i + 1}`,
    delay: (i % 3) * 90,
    arrow: i < arr.length - 2 ? '→' : i === arr.length - 2 ? '·' : '',
    iconBg: dark ? 'rgba(255,255,255,.1)' : SOFT[color] || '#eaf2fe',
    glow: `rgba(${rgb(color)},.16)`,
    shots: t === 'PRODUCER' ? SHOTS : undefined,
  };
});

export type Stat = { n: number; t: string; d: string; color: string; glow: string; delay: number };
export const STATS: Stat[] = [
  { n: 1, t: 'human click per prospect', d: 'Approve the deck on a phone; everything else is automatic.', color: '#ec4b9b', glow: 'rgba(236,75,155,.16)' },
  { n: 24, t: 'images per prospect', d: 'Two catalogues from the photos already on their site.', color: '#1f6ff5', glow: 'rgba(31,111,245,.16)' },
  { n: 0, t: 'copy-paste between tools', d: 'Every hand-off is an API call, logged on a live desk.', color: '#6b4ef0', glow: 'rgba(107,78,240,.16)' },
].map((s, i) => ({ ...s, delay: i * 100 }));

export const DESK = [
  { brand: 'Apparel brand A', note: 'replied yes', status: 'Making deck', color: '#c2700f', bg: '#fdf4ea' },
  { brand: 'Apparel brand B', note: 'deck ready', status: 'Awaiting approval', color: '#c8307f', bg: '#fdeef5' },
  { brand: 'Apparel brand C', note: 'reply sent', status: 'Link opened', color: '#0e8a59', bg: '#e7f7ef' },
  { brand: 'Apparel brand D', note: 'question', status: 'Classified', color: '#1f6ff5', bg: '#eaf2fe' },
];

export const STACK = [
  { t: 'Smartlead', d: 'sending, inboxes, sequences', color: '#6b4ef0' },
  { t: 'Claude', d: 'orchestration, cloud routines, hand-offs', color: '#1f6ff5' },
  { t: 'Agent service on a VPS', d: 'Scout · Judge · Producer · QA · Deck', color: '#f0962b' },
  { t: 'Gemini vision + faishon.studio’s image engine', d: '', color: '#ec4b9b' },
  { t: 'A live desk page', d: 'status, approvals, notes, open tracking', color: '#12a26b' },
];

/* Other jobs the same loop runs; first pill is the trigger, last the outcome. */
export const JOBS: string[][] = [
  ['Lead reply', 'proposal drafted', 'approved', 'sent'],
  ['Support ticket', 'fix drafted', 'reviewed', 'closed'],
  ['Invoice or PO', 'extracted', 'matched', 'posted'],
  ['Weekly numbers', 'five tools', 'one page, Mondays'],
];
