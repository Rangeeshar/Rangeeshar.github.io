// Single source of truth for the site's content. Sections and scenes render from this file.
// In bullets, **text** marks a metric to highlight.

/** [year, month], month 1-12. */
export type YearMonth = [number, number];

export interface Role {
  id: string;
  /** Service-style label used in the trace waterfall. */
  svc: string;
  company: string;
  title: string;
  location: string;
  start: YearMonth;
  /** Omitted while the role is current. */
  end?: YearMonth;
  /** Last month of a part-time stretch at the start of the role. */
  partTimeUntil?: YearMonth;
  /** Title changes within the company, oldest first. */
  positions?: { title: string; start: YearMonth; end: YearMonth; note?: string }[];
  attrs: [key: string, value: string][];
  bullets: string[];
  stack: string[];
}

export interface Project {
  id: string;
  name: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
  link?: { href: string; label: string };
  /** Id of the micro-demo that runs beside the project. */
  demo?: 'video-search' | 'gmail-rules' | 'media-pipeline' | 'split-bill';
}

export const person = {
  name: 'Rangeesh Rajagopal',
  role: 'Lead Software Engineer',
  company: 'HighLevel',
  location: 'Chennai, India',
  email: 'rangees28@gmail.com',
  linkedin: 'https://www.linkedin.com/in/arrangeesh',
  github: 'https://github.com/Rangeeshar',
  site: 'https://rangeeshar.github.io',
  careerStart: [2018, 1] as YearMonth,
  lede: 'I build backend-heavy products that stay fast under load: distributed services, real-time data pipelines and AI tools.',
  description:
    'Lead Software Engineer at HighLevel with 8+ years building AI products, scalable distributed systems and real-time data pipelines.',
  facts: [
    ['throughput', '10K–100K+ rps'],
    ['uptime', '99.95%'],
    ['api latency', '850 → 490 ms'],
    ['experience', '8+ years'],
  ] as [string, string][],
  routes: [
    {
      path: '/build',
      text: 'Backend-heavy products: services handling 10K–100K+ requests per second, real-time pipelines and LLM-powered tools.',
    },
    {
      path: '/stack',
      text: 'End-to-end delivery across backend (Python, FastAPI, Node.js), frontend (React, Next.js) and cloud (AWS).',
    },
    {
      path: '/care',
      text: 'Using AI to build software with real impact, and growing the teams that build it.',
    },
  ],
};

export const roles: Role[] = [
  {
    id: 't4teq',
    svc: 't4teq.web',
    company: 'T4TEQ Software Solutions',
    title: 'Web Developer',
    location: 'Tamil Nadu, India',
    start: [2018, 1],
    end: [2018, 3],
    attrs: [['work', 'web development'], ['mentoring', 'Python']],
    bullets: ['Built web applications and mentored developers in Python'],
    stack: ['Python'],
  },
  {
    id: 'digital-software',
    svc: 'digitalsw.cicd',
    company: 'Digital Software Inc',
    title: 'Software Engineer',
    location: 'Tamil Nadu, India',
    start: [2018, 5],
    end: [2018, 10],
    positions: [
      { title: 'Software Engineer Intern', start: [2018, 5], end: [2018, 7] },
      { title: 'Software Engineer', start: [2018, 7], end: [2018, 10] },
    ],
    attrs: [['rnd.focus', 'CI/CD tooling'], ['rnd.also', 'code hosting tools']],
    bullets: ['Researched and evaluated CI/CD tools and custom code hosting tools'],
    stack: ['CI/CD'],
  },
  {
    id: 'deepcompute',
    svc: 'deepcompute.infra',
    company: 'deepcompute',
    title: 'Software Engineer',
    location: 'Bengaluru, India',
    start: [2018, 10],
    end: [2021, 1],
    positions: [
      { title: 'Associate Software Engineer', start: [2018, 10], end: [2020, 5] },
      { title: 'Software Engineer', start: [2020, 5], end: [2021, 1] },
    ],
    attrs: [
      ['cluster.size', '~600 machines'],
      ['automation.scope', 'microservice environment'],
      ['framework', 'custom Python (Tornado)'],
    ],
    bullets: [
      'Automated an entire microservice environment',
      'Maintained a cluster of around **600 machines**',
      'Contributed to a custom Python framework built on Tornado',
    ],
    stack: ['Python', 'Tornado', 'Microservices'],
  },
  {
    id: 'shiryam',
    svc: 'shiryam.trading',
    company: 'Shiryam Technologies',
    title: 'Senior Software Engineer',
    location: 'Remote',
    start: [2021, 2],
    end: [2023, 3],
    positions: [
      { title: 'Software Engineer', start: [2021, 2], end: [2022, 4] },
      { title: 'Senior Software Engineer', start: [2022, 4], end: [2023, 3] },
    ],
    attrs: [
      ['team.size', '10 developers'],
      ['features.per_week', '5 major'],
      ['order.latency', '< 500 ms'],
      ['trades.per_day', '10K+'],
      ['deploy.time', '20 min → 0'],
      ['infra.provision', '~15 min'],
    ],
    bullets: [
      'Led a team of **10 developers**; instituted Git, code review and testing practices that let the team close **5 major features per week**',
      'Architected an algorithmic trading platform from scratch, placing orders in **under 500 ms** and handling **10K+ trades/day**',
      'Automated deployments from **20 minutes to zero** manual steps',
      'Wrote Terraform that builds a complete client infrastructure, including load balancers and public/private networks, in **~15 minutes**',
      'The platform reached **$25K/day peak profit**, and disciplined delivery materially increased release velocity',
    ],
    stack: ['Python', 'Terraform', 'AWS'],
  },
  {
    id: 'metafire',
    svc: 'metafire.web3',
    company: 'MetaFire Financial',
    title: 'Senior Software Engineer',
    location: 'United States (Remote)',
    start: [2022, 4],
    end: [2024, 4],
    partTimeUntil: [2023, 3],
    positions: [
      { title: 'Senior Software Engineer', start: [2022, 4], end: [2023, 3], note: 'part-time' },
      { title: 'Senior Software Engineer', start: [2023, 4], end: [2024, 4], note: 'full-time' },
    ],
    attrs: [
      ['employment', 'part-time → full-time'],
      ['api.latency', '850 ms → 490 ms'],
      ['throughput', '1.2×'],
      ['test.coverage', '54% → 88%'],
      ['prod.defects', '−62%'],
    ],
    bullets: [
      'Built a dApp frontend that interacts with smart contracts, and a backend that scales and secures application requests',
      'Reduced API response time **42%**, from 850 ms to 490 ms, for a **1.2× increase in throughput**',
      'Reworked onboarding to cut setup time by **40%**, adding **2,000 new accounts in 3 months**',
      'Built NFT APIs and wallet integrations that raised user conversion by **25%**, and DDoS mitigation that cut malicious traffic by **60%**',
      'Expanded test coverage from **54% to 88%**, reducing production defects by **62%**',
    ],
    stack: ['TypeScript', 'Node.js', 'Express', 'Redis', 'MongoDB', 'AWS'],
  },
  {
    id: 'deloitte',
    svc: 'deloitte.genai',
    company: 'Deloitte',
    title: 'Full Stack Engineer (Contract)',
    location: 'Chennai, India',
    start: [2024, 5],
    end: [2024, 10],
    attrs: [
      ['llm.answer_variance', '−25%'],
      ['triage.time_saved', '5 h/week'],
      ['peak.load', '3×'],
    ],
    bullets: [
      'Designed multi-agent enterprise conversational systems with Python, React, LangChain and LangGraph to improve document discoverability',
      'Implemented reflection and consensus strategies that reduced LLM answer variance by **25%**',
      'Integrated Langfuse for evaluation and tracing, cutting incident triage by **5 hours per week**',
      'Architected auto scaling to absorb **3× peak load**',
    ],
    stack: ['Python', 'React', 'LangChain', 'LangGraph', 'Langfuse'],
  },
  {
    id: 'jupitrr',
    svc: 'jupitrr.media',
    company: 'Jupitrr AI',
    title: 'Senior Software Engineer',
    location: 'United Kingdom (Remote)',
    start: [2024, 10],
    end: [2026, 2],
    attrs: [
      ['user.adoption', '+70%'],
      ['pipeline.processing_time', '−55%'],
      ['cpu.usage', '−30%'],
      ['uptime', '99.95%'],
      ['tests.pass_rate', '98%'],
    ],
    bullets: [
      'Led end-to-end development of AI-assisted media editing workflows, contributing to a **70% uplift in user adoption**',
      'Optimized the AI editor pipeline, cutting processing time by **55%** and CPU usage by **30%**',
      'Introduced caching and async tasks that kept the system at **99.95% uptime** through launch-day peaks',
      'Built an automated regression suite and linting, raising release stability to a **98% test success rate**',
    ],
    stack: ['Python', 'FastAPI', 'React', 'Node.js', 'TypeScript', 'OpenAI', 'AWS Bedrock', 'Redis', 'PostgreSQL'],
  },
  {
    id: 'highlevel',
    svc: 'highlevel.lead',
    company: 'HighLevel',
    title: 'Lead Software Engineer',
    location: 'Chennai, India',
    start: [2026, 2],
    attrs: [['span.status', 'open · in flight'], ['started', 'Feb 2026']],
    bullets: [],
    stack: [],
  },
];

export const projects: Project[] = [
  {
    id: 'semantic-video-search',
    name: 'Semantic Video Search',
    kicker: 'AI-powered video search engine',
    summary:
      'Search anything said in your videos with a plain-language question, then jump straight to the moment it happens.',
    points: [
      'Natural-language search over ChromaDB vector embeddings',
      'Deepgram transcription with word-level timestamps',
      'Interactive transcript: click any word to seek the video',
      'Timestamped comments for collaborative editing',
    ],
    stack: ['ChromaDB', 'Deepgram', 'Vector search'],
    link: { href: 'https://github.com/Rangeeshar/semantic-video-search', label: 'View on GitHub' },
    demo: 'video-search',
  },
  {
    id: 'media-pipeline',
    name: 'AI Media Editing Platform',
    kicker: 'Jupitrr AI · production pipeline',
    summary:
      'High-throughput pipelines that take a raw upload through transcription, segmentation, rendering and export.',
    points: [
      'Ingest, transcribe, segment, render and export as independent stages',
      'Frame-accurate previews with HLS and animation frameworks',
      'Rebuilt rendering and export to **98%** reliability',
      'Reduced manual editing effort by **70%**',
    ],
    stack: ['Python', 'FastAPI', 'Redis', 'AWS Bedrock', 'HLS'],
    demo: 'media-pipeline',
  },
  {
    id: 'gmail-actions',
    name: 'Gmail Actions',
    kicker: 'Rule-based email processing engine',
    summary:
      'Connects to a Gmail account and applies JSON rules to incoming mail: match on sender, subject, date or body, then act.',
    points: [
      'Gmail API with OAuth2 for secure access',
      'SQLite storage for fast querying',
      'Conditions on From, To, Subject, Date and Message',
      'Actions: mark read or unread, move to labels',
    ],
    stack: ['Gmail API', 'OAuth2', 'SQLite'],
    link: { href: 'https://github.com/Rangeeshar/gmail-actions', label: 'View on GitHub' },
    demo: 'gmail-rules',
  },
  {
    id: 'splitbiller',
    name: 'SplitBiller',
    kicker: 'Free expense splitter',
    summary:
      'A free alternative to Splitwise. No signup and no account: split a group bill instantly, with every calculation done in your browser.',
    points: [
      'No login or signup required',
      'Privacy-first: nothing is stored or sent',
      'Mobile-friendly and lightweight',
      'Made for dinners, trips and roommates',
    ],
    stack: ['Web', 'Client-side'],
    link: { href: 'https://splitbiller.com/', label: 'Visit SplitBiller' },
    demo: 'split-bill',
  },
  {
    id: 'discount-store',
    name: 'Discount Store',
    kicker: 'Shopify volume discount app',
    summary:
      'Lets store owners configure volume discounts such as "Buy 2, get 10% off", applied automatically at checkout.',
    points: [
      'Admin panel with product picker',
      'Custom Shopify discount function at checkout',
      'Theme app extension for product-page messages',
    ],
    stack: ['React Router', 'Shopify Functions'],
    link: { href: 'https://github.com/Rangeeshar/discount-store', label: 'View on GitHub' },
  },
  {
    id: 'nurexus',
    name: 'Nurexus',
    kicker: 'Journal of MedVerse Research & Practice',
    summary:
      'A medical research journal platform where researchers, faculty and students publish and discover peer-reviewed work.',
    points: [
      'Searchable article database with filters',
      'Article submission for researchers',
      'Built for collaboration across the medical community',
    ],
    stack: ['Web platform'],
    link: { href: 'https://www.nurexus.com/', label: 'Visit Nurexus' },
  },
];

/** Skills by the architecture layer they serve. */
export const layers: [layer: string, skills: string[]][] = [
  ['client', ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind', 'React Router']],
  ['api', ['Python', 'FastAPI', 'Node.js', 'Express', 'Django', 'Tornado']],
  ['ai', ['OpenAI', 'AWS Bedrock', 'LangChain', 'LangGraph', 'Langfuse', 'ChromaDB', 'Deepgram']],
  ['data', ['PostgreSQL', 'Redis', 'MongoDB', 'SQLite']],
  ['infra', ['AWS', 'GCP', 'Terraform', 'NGINX', 'Microservices', 'CI/CD']],
  ['platforms', ['Gmail API', 'OAuth2', 'Shopify Functions', 'Smart Contracts', 'HLS']],
];

/** Work that lights up the stack map. Each entry names only tools listed on that role or project. */
export const evidence: [label: string, skills: string[]][] = [
  ['AI media platform', [...roles.find((r) => r.id === 'jupitrr')!.stack, 'HLS']],
  ['Multi-agent GenAI', roles.find((r) => r.id === 'deloitte')!.stack],
  ['dApp platform', [...roles.find((r) => r.id === 'metafire')!.stack, 'Smart Contracts']],
  ['Trading platform', roles.find((r) => r.id === 'shiryam')!.stack],
  ['Cluster automation', roles.find((r) => r.id === 'deepcompute')!.stack],
  ['Semantic Video Search', ['ChromaDB', 'Deepgram']],
  ['Gmail Actions', ['Gmail API', 'OAuth2', 'SQLite']],
  ['Discount Store', ['React Router', 'Shopify Functions']],
];

export const education = {
  degree: 'B.E., Computer Science and Engineering',
  school: 'SRM TRP Engineering College, Trichy (Anna University)',
  years: '2014 – 2018',
};

export const certifications = [
  'Python Core Language: Expert',
  'High Level System Design for Quora',
  'Socket Programming in C from Scratch',
];

export const publications = ['An Approach to Accept Voice in Code Editor'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtMonth = ([y, m]: YearMonth) => `${MONTHS[m - 1]} ${y}`;
export const fmtRange = (start: YearMonth, end?: YearMonth) => `${fmtMonth(start)} – ${end ? fmtMonth(end) : 'Present'}`;

/** The request's path through the page: section id, latency offset, human label. In scroll order. */
export const hops: [id: string, ms: number, label: string][] = [
  ['edge', 0, 'Intro'],
  ['gateway', 3, 'About'],
  ['services', 5, 'Experience'],
  ['workloads', 41, 'Work'],
  ['stack', 43, 'Skills'],
  ['response', 47, 'Contact'],
];
