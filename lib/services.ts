/*
 * Content, images and accent colours for the four service pages and the services index.
 * Each service page is a list of typed sections rendered by components/services/ServicePage.tsx.
 * Images and videos live in public/assets.
 */

export type ServiceKey = 'content' | 'ecommerce' | 'automation' | 'b2b';

export type Accent = { main: string; soft: string; text: string; light: string; rgb: string; hue: number };

export const ACCENTS: Record<ServiceKey, Accent> = {
  content: { main: '#6b4ef0', soft: '#f1eefd', text: '#5b3fe0', light: '#b8a6ff', rgb: '107,78,240', hue: 0 },
  ecommerce: { main: '#1f7cf5', soft: '#eaf2fe', text: '#1f6ff5', light: '#8db4ff', rgb: '31,124,245', hue: 0.25 },
  automation: { main: '#f0962b', soft: '#fdf4ea', text: '#c2700f', light: '#ffc27a', rgb: '240,150,43', hue: 0.75 },
  b2b: { main: '#ec4b9b', soft: '#fdeef5', text: '#c8307f', light: '#f59ac6', rgb: '236,75,155', hue: 0.5 },
};

export type ServicePageMeta = { key: ServiceKey; slug: string; name: string; tagline: string; href: string; formLabel: string };

export const SERVICE_PAGES: ServicePageMeta[] = [
  { key: 'content', slug: 'content-creative', name: 'Content & Creative', tagline: 'Creative & communication', href: '/services/content-creative', formLabel: 'Content, creative & communication' },
  { key: 'ecommerce', slug: 'ecommerce-growth', name: 'E-commerce Growth', tagline: 'Marketplace & D2C', href: '/services/ecommerce-growth', formLabel: 'E-commerce & digital sales growth' },
  { key: 'automation', slug: 'automation-ai', name: 'AI & Automation', tagline: 'AI & workflows', href: '/services/automation-ai', formLabel: 'Marketing automation & AI enablement' },
  { key: 'b2b', slug: 'b2b-lead-generation', name: 'B2B Lead Generation', tagline: 'Lead generation & outreach', href: '/services/b2b-lead-generation', formLabel: 'B2B lead generation & sales outreach' },
];

export const pageBySlug = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug);
export const pageByKey = (key: ServiceKey) => SERVICE_PAGES.find((p) => p.key === key)!;

export type Step = { t: string; d?: string };
export type Tile = { tag: string; img: string; row: string; col: string };
export type CaseIcon = 'search' | 'pen' | 'folder' | 'approve' | 'send';
export type CaseStep = { t: string; d: string; icon: CaseIcon; color: string; bg: string };

export type Section =
  | {
      type: 'hero';
      eyebrow: string;
      h1a: string;
      h1b: string;
      p1: string;
      p2: string;
      cta1: string;
      cta2: string;
      vis: 'tiles' | 'media';
      tiles?: Tile[];
      img?: string;
      video?: string;
      chainLabel?: string;
      sources?: string[];
      chain?: string[];
      end?: string;
    }
  | { type: 'prop'; h2: string; p: string[]; hl: string }
  | { type: 'cards'; eyebrow: string; cards: { t: string; sub: string; body: string }[] }
  | { type: 'paths'; panels: { tag: string; t: string; intro: string; items: Step[] }[] }
  | { type: 'flow'; h2: string; steps: Step[]; anchor?: string; minCol?: string }
  | { type: 'bands'; h2: string; before: string; chain: string[]; outcome: string; note: string }
  | { type: 'split'; img: string; h2: string; p: string[]; chain?: string[] }
  | { type: 'eco'; h2: string; items: { q: string; a: string }[]; close: string }
  | { type: 'how'; steps: Step[] }
  | { type: 'three'; eyebrow: string; engage?: boolean; strip?: boolean; items: Step[] }
  | { type: 'work'; h2: string; cats: string[]; imgs: string[]; rows: string[]; ph: string }
  | {
      type: 'case';
      eyebrow: string;
      h2a: string;
      h2b: string;
      p1: string;
      p2: string;
      label: string;
      steps: CaseStep[];
      note: string;
      card: { h3: string; p: string; cta1: string; cta2: string };
      quote: string;
    }
  | { type: 'cta'; h2: string; p: string; cta: string };

const T = (t: string, d?: string): Step => ({ t, d });
const A = (file: string) => `/assets/${file}`;

export const SERVICE_DATA: Record<ServiceKey, Section[]> = {
  content: [
    {
      type: 'hero',
      eyebrow: 'Content, Creative & Communication',
      h1a: 'Turn ideas into communication',
      h1b: 'that moves customers.',
      p1: 'Your brand needs more than a constant stream of content. It needs communication that helps people understand what you offer, why it matters and what to do next.',
      p2: '3rd i Visuals connects content strategy, creative thinking and production to help brands communicate consistently across campaigns, channels and customer touchpoints.',
      cta1: 'Discuss Your Content Requirement',
      cta2: 'Explore Our Capabilities ↓',
      vis: 'tiles',
      tiles: [
        { tag: 'Campaign concept', img: A('team-creative.jpg'), row: '1 / span 2', col: '1' },
        { tag: 'Video frame', img: A('camera.jpg'), row: '1', col: '2' },
        { tag: 'Product visual', img: A('product-headphones.jpg'), row: '2 / span 2', col: '2' },
        { tag: 'Social creative', img: A('social-phone.jpg'), row: '3', col: '1' },
      ],
    },
    {
      type: 'prop',
      h2: 'Content should work as a system.',
      p: [
        'A campaign, product video, marketplace listing and sales presentation may serve different purposes. They should still tell a connected story.',
        'We start with your audience, your proposition and the action you want to encourage. Then we build the content and creative needed to support it.',
      ],
      hl: 'From what your business wants to say to what your customer needs to understand.',
    },
    {
      type: 'cards',
      eyebrow: 'Capabilities',
      cards: [
        { t: 'Content Strategy & Planning', sub: 'Give your content a clear role in the business.', body: 'Audience understanding, content themes, channel planning, campaign calendars and messaging frameworks that connect everyday communication to broader marketing objectives.' },
        { t: 'Brand & Campaign Communication', sub: 'Build a consistent message across customer touchpoints.', body: 'Brand messaging, campaign concepts, copywriting and creative development for launches, promotions and ongoing communication.' },
        { t: 'Social Media & Performance Creative', sub: 'Create for the channel and the action.', body: 'Social content, advertising creative and creative variations designed around the audience, placement and campaign objective.' },
        { t: 'Video Production & AI Video', sub: 'Choose the production approach that fits the idea.', body: 'Brand films, product videos, explainers, social video and AI-assisted video production, with the format and workflow shaped around the brief.' },
        { t: 'Product Content, 3D & CGI', sub: 'Help customers see and understand the product.', body: 'Product visuals, demonstrations, 3D and CGI assets, marketplace content and D2C creative that communicate features, use and value.' },
        { t: 'Customer & Sales Communication', sub: 'Keep the message connected beyond the first impression.', body: 'Email and WhatsApp communication, presentations, sales collateral and supporting content for different stages of the customer journey.' },
      ],
    },
    {
      type: 'flow',
      h2: 'One message. The right expression at every stage.',
      steps: [
        T('Attention', 'Social content, campaign creative and short video.'),
        T('Understanding', 'Explainers, product demonstrations and brand communication.'),
        T('Consideration', 'Product content, presentations and supporting information.'),
        T('Action', 'Performance creative, landing-page content and promotional communication.'),
        T('Ongoing engagement', 'Email, WhatsApp and customer communication.'),
      ],
    },
    {
      type: 'eco',
      h2: 'Better creative starts with knowing what it needs to achieve.',
      items: [
        { q: 'Traffic is strong, but conversion is weak.', a: 'The requirement may extend from advertising creative to product content and the landing-page journey.' },
        { q: 'You are launching across marketplaces and D2C.', a: 'Product messaging, listings, campaign assets and website content need to work together.' },
        { q: 'Your team struggles to maintain content output.', a: 'The answer may involve a clearer content system, reusable formats and workflow automation.' },
      ],
      close: 'We can connect creative with growth and automation when the problem calls for it.',
    },
    {
      type: 'how',
      steps: [
        T('Understand', 'Your audience, business objective, proposition and existing content.'),
        T('Define', 'The message, creative direction, formats and channels.'),
        T('Create', 'Develop copy, design, video and other required assets.'),
        T('Deliver', 'Adapt and prepare content for the agreed customer touchpoints.'),
        T('Review & Improve', 'Use feedback and available performance data to guide the next iteration.'),
      ],
    },
    {
      type: 'three',
      eyebrow: 'Ways to engage',
      engage: true,
      items: [
        T('Focused Creative Project', 'A campaign, video, product-content requirement or defined set of assets.'),
        T('Ongoing Content Partnership', 'Recurring planning and production for consistent brand and channel communication.'),
        T('Integrated Campaign Support', 'Creative working alongside e-commerce, performance marketing, outreach or automation.'),
      ],
    },
    {
      type: 'work',
      h2: 'See how the communication comes together.',
      cats: ['Brand & Campaigns', 'Video & Motion', 'Product & Performance'],
      imgs: [A('team-table.jpg'), A('video-edit.jpg'), A('product-watch.jpg')],
      rows: ['Brief', 'Creative approach', 'Delivered work'],
      ph: 'approved work example',
    },
    {
      type: 'cta',
      h2: 'What does your brand need to communicate better?',
      p: 'Tell us what you are launching, explaining or trying to improve. We’ll help identify the message, formats and production approach that fit.',
      cta: 'Discuss Your Content Requirement',
    },
  ],

  ecommerce: [
    {
      type: 'hero',
      eyebrow: 'E-commerce & Digital Sales Growth',
      h1a: 'Turn digital channels into',
      h1b: 'stronger sales channels.',
      p1: 'Online growth depends on more than traffic. Customers need to find your products, understand their value and feel confident enough to buy.',
      p2: '3rd i Visuals connects marketplace management, D2C, content, advertising and conversion optimisation to help businesses build a more connected digital sales operation.',
      cta1: 'Discuss Your Online Growth',
      cta2: 'Explore Marketplace & D2C Services ↓',
      vis: 'media',
      img: A('shopping-bags.jpg'),
      chainLabel: 'THE SALES JOURNEY',
      sources: ['Marketplace', 'D2C'],
      chain: ['Visibility', 'Product experience', 'Conversion', 'Repeat purchase'],
    },
    {
      type: 'prop',
      h2: 'Connect the work behind the sale.',
      p: [
        'Advertising can bring customers to a product. It cannot solve every issue with the listing, website, pricing or purchase journey.',
        'We look across the sales channel to understand where growth is being held back and which changes deserve attention first.',
      ],
      hl: 'Visibility, content, advertising and conversion should support the same sales objective.',
    },
    {
      type: 'paths',
      panels: [
        {
          tag: 'Path 01',
          t: 'Marketplace Growth',
          intro: 'Build a stronger marketplace presence, from catalogue foundations to ongoing optimisation.',
          items: [
            T('Marketplace Management', 'Coordinate listings, advertising, promotions and account activity.'),
            T('Amazon India, US & UK', 'Support marketplace activity around the requirements of the target market.'),
            T('Listings & Catalogue', 'Improve product information, catalogue structure and the quality of the listing experience.'),
            T('Marketplace SEO & Amazon PPC', 'Connect product discoverability with relevant advertising.'),
            T('Commercial & Account Operations', 'Support pricing, promotions, reviews, account health and performance analysis.'),
          ],
        },
        {
          tag: 'Path 02',
          t: 'D2C Growth',
          intro: 'Build a more connected route from customer acquisition to purchase and retention.',
          items: [
            T('E-commerce Websites', 'Develop or improve Shopify and WooCommerce stores around the buying journey.'),
            T('Google & Meta Advertising', 'Plan and manage acquisition activity around the product, audience and business objective.'),
            T('SEO & AEO / AI Search Optimisation', 'Improve the clarity, structure and discoverability of useful brand and product content.'),
            T('Conversion Rate Optimisation', 'Identify friction across product pages, landing pages, checkout and supporting information.'),
            T('Retention & Analytics', 'Connect retargeting, email, WhatsApp and reporting to ongoing customer engagement.'),
          ],
        },
      ],
    },
    {
      type: 'flow',
      h2: 'Where is your sales journey losing momentum?',
      steps: [
        T('Discover', 'Can the right customers find your products?'),
        T('Visit', 'Does your advertising attract relevant traffic?'),
        T('Evaluate', 'Does the content answer the questions that matter?'),
        T('Buy', 'Is the purchase journey clear and easy to complete?'),
        T('Return', 'Is there a reason and a route for customers to come back?'),
      ],
    },
    {
      type: 'eco',
      h2: 'More traffic is not always the first answer.',
      items: [
        { q: 'Listings receive views, but orders remain weak.', a: 'Review product content, pricing, customer questions and conversion barriers.' },
        { q: 'Ads generate clicks, but the website loses customers.', a: 'Connect campaign messaging with the landing page and purchase experience.' },
        { q: 'Customers buy once and disappear.', a: 'Look at retention communication, retargeting and customer follow-up.' },
      ],
      close: 'We bring the relevant creative, growth and automation capabilities into the same problem.',
    },
    {
      type: 'how',
      steps: [
        T('Review', 'Understand your products, channels, objectives and available performance data.'),
        T('Prioritise', 'Identify the most significant barriers and opportunities.'),
        T('Build & Improve', 'Strengthen listings, content, website journeys and measurement.'),
        T('Manage & Execute', 'Run the agreed marketplace, acquisition and retention activity.'),
        T('Measure & Optimise', 'Review performance and refine the work against agreed business priorities.'),
      ],
    },
    {
      type: 'three',
      eyebrow: 'Ways to engage',
      engage: true,
      items: [
        T('Launch or Improvement Project', 'A marketplace launch, catalogue improvement, website or conversion-focused requirement.'),
        T('Managed Channel Growth', 'Ongoing marketplace management, D2C marketing or a defined channel responsibility.'),
        T('Integrated Digital Sales Partner', 'Marketplace, D2C, creative, advertising and retention working around a shared sales objective.'),
      ],
    },
    {
      type: 'work',
      h2: 'See the work behind digital sales growth.',
      cats: ['Marketplace Growth', 'D2C Experience', 'Acquisition & Conversion'],
      imgs: [A('shopping-card.jpg'), A('checkout.jpg'), A('analytics.jpg')],
      rows: ['Starting problem', 'Changes made', 'Verified outcome'],
      ph: 'approved case study',
    },
    {
      type: 'cta',
      h2: 'Where is your online growth getting stuck?',
      p: 'Tell us what you sell, where you sell it and what is holding performance back. We’ll help identify the right starting point.',
      cta: 'Discuss Your Online Growth',
    },
  ],

  automation: [
    {
      type: 'hero',
      eyebrow: 'Marketing Automation & AI Enablement',
      h1a: 'Make marketing and sales',
      h1b: 'work smarter.',
      p1: 'Repetitive tasks, disconnected tools and manual follow-ups can slow a growing business down.',
      p2: '3rd i Visuals helps identify these bottlenecks and build practical automation and AI workflows around the way your team needs to work.',
      cta1: 'Discuss Your Workflow Challenge',
      cta2: 'Explore What We Automate ↓',
      vis: 'media',
      video: A('video-network.mp4'),
      img: A('ai.jpg'),
      chainLabel: 'AUTOMATED WORKFLOW',
      sources: ['Repetitive tasks', 'Disconnected tools', 'Manual follow-ups'],
      chain: ['Capture', 'Structure', 'Route', 'Update CRM', 'Trigger follow-up'],
      end: 'Clear operational outcome',
    },
    {
      type: 'prop',
      h2: 'Problem first. Technology second.',
      p: [
        'We don’t begin by selling an AI tool.',
        'We first understand what is taking too much time, where information is getting lost and which processes are difficult to scale. Then we identify where automation, AI or a simpler workflow can help.',
      ],
      hl: 'The objective is a better process your team can actually use.',
    },
    {
      type: 'cards',
      eyebrow: 'What we automate',
      cards: [
        { t: 'Lead Capture, Routing & CRM', sub: 'Help enquiries reach the right place with the right context.', body: 'Lead capture, assignment, CRM updates and follow-up workflows that reduce repeated manual handling.' },
        { t: 'Lead Qualification & AI Agents', sub: 'Support the early work around incoming enquiries.', body: 'Structured information gathering, initial qualification and task-specific AI assistance, with human review where the process requires it.' },
        { t: 'Email & WhatsApp Automation', sub: 'Make customer communication more consistent.', body: 'Triggered messages, reminders and follow-up sequences connected to agreed customer or sales stages.' },
        { t: 'Marketing & Content Workflows', sub: 'Reduce friction between planning and delivery.', body: 'Connect briefs, content preparation, approvals, scheduling and handoffs around your existing working process.' },
        { t: 'Dashboards & Reporting', sub: 'Bring the information your team needs into a clearer view.', body: 'Connect agreed data sources and reporting routines to reduce repeated collection and manual preparation.' },
        { t: 'Custom AI Solutions', sub: 'Apply AI to a defined business task.', body: 'Explore workflows for research, information handling, content support and other repetitive activities where AI is appropriate.' },
      ],
    },
    {
      type: 'bands',
      h2: 'Make the improvement visible.',
      before: 'Enquiries arrive in different places. Details are copied manually. Follow-ups depend on individual reminders.',
      chain: ['Capture', 'Structure', 'Route', 'Update CRM', 'Trigger follow-up', 'Flag exceptions'],
      outcome: 'Clearer ownership, less repeated handling and more consistent follow-through.',
      note: 'Illustrative workflow. The final process depends on your systems and requirements.',
    },
    {
      type: 'split',
      img: A('ai.jpg'),
      h2: 'Use AI where judgement and workflow design make it useful.',
      p: [
        'Some tasks benefit from a straightforward rule. Others may benefit from AI assistance. Some decisions should stay with your team.',
        'We define the role of each before building the workflow, including the information it uses, the actions it can take and when a person needs to step in.',
      ],
    },
    {
      type: 'eco',
      h2: 'Automation works better when it understands the work around it.',
      items: [
        { q: 'Leads are arriving, but follow-up is inconsistent.', a: 'Connect acquisition, qualification, CRM and sales communication.' },
        { q: 'Content production is growing, but coordination is becoming harder.', a: 'Connect planning, creation, review and publishing workflows.' },
        { q: 'Reporting takes time away from action.', a: 'Connect data collection and reporting to the decisions the team needs to make.' },
      ],
      close: 'We connect the process around the business problem, rather than adding another isolated tool.',
    },
    {
      type: 'how',
      steps: [
        T('Map', 'Understand the current process, people, tools and bottlenecks.'),
        T('Prioritise', 'Choose a useful, achievable improvement with a clear purpose.'),
        T('Build', 'Configure the workflow, integrations and relevant AI components.'),
        T('Validate & Introduce', 'Test realistic scenarios, review exceptions and prepare the team to use it.'),
        T('Monitor & Improve', 'Review the workflow in use and refine it as requirements change.'),
      ],
    },
    {
      type: 'three',
      eyebrow: 'Ways to engage',
      engage: true,
      strip: true,
      items: [
        T('Focused Automation Project', 'One defined workflow, integration or operational bottleneck.'),
        T('Ongoing Workflow Support', 'Maintain and improve an agreed set of marketing and sales automations.'),
        T('Broader AI Enablement', 'Identify and implement connected opportunities across a wider business process.'),
      ],
    },
    {
      type: 'case',
      eyebrow: 'AI & Automation in Action',
      h2a: 'From content planning to publishing.',
      h2b: 'One connected workflow.',
      p1: 'Social media involves more than creating a post. Reviewing previous content, preparing copy and visuals, organising assets, getting approval and checking the published result all need to work together.',
      p2: 'We built a connected workflow for 3rd i Visuals that brings these steps together—with human approval before publication.',
      label: 'REVIEW → PREPARE → STORE → APPROVE → PUBLISH & VERIFY',
      steps: [
        { t: 'Review', d: 'Check recent publishing activity before choosing the next topic.', icon: 'search', color: '#1f6ff5', bg: '#eaf2fe' },
        { t: 'Prepare', d: 'Develop the caption and branded visual around the agreed direction.', icon: 'pen', color: '#6b4ef0', bg: '#f1eefd' },
        { t: 'Store', d: 'Keep the final copy and creative together, ready for review.', icon: 'folder', color: '#12a26b', bg: '#e7f7ef' },
        { t: 'Approve', d: 'Review the exact post before it goes live.', icon: 'approve', color: '#f0962b', bg: '#fdf4ea' },
        { t: 'Publish & Verify', d: 'Publish after approval and check the live result.', icon: 'send', color: '#ec4b9b', bg: '#fdeef5' },
      ],
      note: 'Human approval before publication',
      card: {
        h3: 'Built around the process. With people in control.',
        p: 'A practical example of how we connect content, brand assets and marketing operations through AI-enabled workflows.',
        cta1: 'Explore the Workflow →',
        cta2: 'Discuss Your Automation Challenge →',
      },
      quote: 'Built and used for our own LinkedIn company-page publishing.',
    },
    {
      type: 'work',
      h2: 'See how the workflow works.',
      cats: ['Lead Management', 'Content Operations', 'Reporting & AI Workflows'],
      imgs: [A('workspace.jpg'), A('team-laptops.jpg'), A('dashboard.jpg')],
      rows: ['Manual process', 'Implemented workflow', 'Verified operational change'],
      ph: 'demonstration or client case study',
    },
    {
      type: 'cta',
      h2: 'What is your team doing repeatedly that could work better?',
      p: 'Tell us about the task, the tools involved and where the process slows down. We’ll help identify a practical next step.',
      cta: 'Discuss Your Workflow Challenge',
    },
  ],

  b2b: [
    {
      type: 'hero',
      eyebrow: 'B2B Lead Generation & Sales Outreach',
      h1a: 'Build a more systematic route',
      h1b: 'to new B2B customers.',
      p1: 'Reaching more people is only useful when you are reaching the right businesses with a relevant reason to talk.',
      p2: '3rd i Visuals connects prospect targeting, data, messaging, outreach and follow-up to help businesses build structured outbound programmes designed to generate qualified sales conversations.',
      cta1: 'Discuss Your B2B Pipeline',
      cta2: 'Explore Our Outbound Approach ↓',
      vis: 'media',
      video: A('video-team.mp4'),
      img: A('b2b-meeting.jpg'),
      chainLabel: 'THE OUTBOUND ENGINE',
      chain: ['ICP', 'Data', 'Messaging', 'Cold Email', 'LinkedIn', 'Follow-up', 'Qualified Meetings', 'CRM'],
      end: 'Qualified sales conversations',
    },
    {
      type: 'prop',
      h2: 'A pipeline needs a process behind it.',
      p: [
        'A database alone is not a prospecting strategy. Sending messages alone is not a complete acquisition system.',
        'The work needs to connect who you target, what you say, how you follow up and what happens when someone shows interest.',
      ],
      hl: 'We build the route from the right prospect to a useful sales conversation.',
    },
    {
      type: 'flow',
      anchor: 'capabilities',
      h2: 'Every stage has a job to do.',
      minCol: '130px',
      steps: ['ICP', 'Data', 'Messaging', 'Cold Email', 'LinkedIn', 'Follow-up', 'Qualified Meetings', 'CRM'].map((t) => T(t)),
    },
    {
      type: 'cards',
      eyebrow: 'Capabilities',
      cards: [
        { t: 'ICP Definition & Targeting', sub: 'Define the businesses and decision-makers you want to reach.', body: 'Clarify the customer profile, relevant roles, business needs and targeting criteria that will shape the programme.' },
        { t: 'Prospect Data & Enrichment', sub: 'Build the information base for relevant outreach.', body: 'Prospect database building, data enrichment and organisation around the agreed target profile.' },
        { t: 'Messaging & Outreach Preparation', sub: 'Give the right prospect a clear reason to respond.', body: 'Develop the value proposition, outreach copy and supporting messages around the audience and offer.' },
        { t: 'Cold Email & LinkedIn Outreach', sub: 'Run coordinated outreach across the agreed channels.', body: 'Structure campaign activity and channel-specific messaging around the prospecting objective.' },
        { t: 'Follow-up & Appointment Setting', sub: 'Keep interested conversations moving.', body: 'Build follow-up sequences, support response handling and coordinate meetings around agreed qualification criteria.' },
        { t: 'CRM & Sales Handover', sub: 'Keep context attached to the opportunity.', body: 'Lead management, CRM updates and structured handover to help sales teams continue the conversation. Inside sales support can be scoped where required.' },
      ],
    },
    {
      type: 'split',
      img: A('office-meeting.jpg'),
      h2: 'Define a useful conversation before you launch.',
      p: [
        '“Qualified” should mean something specific to your business.',
        'Before outreach begins, we agree what makes a prospect relevant, what information needs to be captured and when a conversation is ready for your sales team.',
      ],
      chain: ['Clear targeting', 'Agreed qualification', 'Better handover'],
    },
    {
      type: 'eco',
      h2: 'The reply is only one part of the journey.',
      items: [
        { q: 'The targeting is right, but the message is not landing.', a: 'Review the proposition, outreach copy and supporting content.' },
        { q: 'Prospects show interest, but follow-up is inconsistent.', a: 'Connect response handling, reminders and CRM workflows.' },
        { q: 'Meetings happen, but the sales team lacks context.', a: 'Improve qualification, information capture and handover.' },
      ],
      close: 'We can connect outreach with the creative and automation needed to support the next step.',
    },
    {
      type: 'how',
      steps: [
        T('Understand', 'Your offer, target market, sales process and new-business objective.'),
        T('Define', 'The ICP, targeting criteria, proposition and qualification requirements.'),
        T('Build', 'Prepare prospect data, messaging, outreach sequences and CRM workflow.'),
        T('Execute', 'Run the agreed outreach, follow-up and appointment-setting activity.'),
        T('Review & Improve', 'Use response patterns, conversation quality and pipeline feedback to refine the programme.'),
      ],
    },
    {
      type: 'three',
      eyebrow: 'Who this is for',
      items: [
        T('B2B Companies', 'Reach relevant businesses and decision-makers around a defined offer.'),
        T('SaaS Businesses', 'Build structured prospecting around the customer profile and use case.'),
        T('Service Businesses', 'Create a more consistent approach to new-business conversations.'),
      ],
    },
    {
      type: 'three',
      eyebrow: 'Ways to engage',
      engage: true,
      items: [
        T('Outbound Setup Project', 'Define the targeting, data, messaging and workflow for a new programme.'),
        T('Managed Outreach', 'Ongoing execution and improvement of an agreed outbound programme.'),
        T('Integrated Acquisition Support', 'Outreach, content and automation working together around a broader pipeline objective.'),
      ],
    },
    {
      type: 'work',
      h2: 'See the process behind the pipeline.',
      cats: ['Targeting & Messaging', 'Outreach Programmes', 'Follow-up & CRM'],
      imgs: [A('meeting.jpg'), A('handshake.jpg'), A('chip.jpg')],
      rows: ['Business objective', 'Programme approach', 'Verified outcome'],
      ph: 'approved example',
    },
    {
      type: 'cta',
      h2: 'Who do you need to reach—and what is getting in the way?',
      p: 'Tell us about your offer, your ideal customer and how you currently generate new business. We’ll help identify where a more structured outbound approach can help.',
      cta: 'Discuss Your B2B Pipeline',
    },
  ],
};

export const pad = (i: number) => String(i + 1).padStart(2, '0');
