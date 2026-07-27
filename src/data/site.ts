/* ═══════════════════════════════════════════════════════════════
   Content for the standalone pages (Careers, Tenders, News,
   Articles, Forms).

   These five content types are deliberately kept as separate
   shapes rather than one generic "post", because they are read
   for different reasons and answer different questions:

     news      — "what did the bank just do?"      → dated, image-led
     articles  — "help me understand something"    → authored, timed read
     notices   — "does this affect my account?"    → reference + effective date
     tenders   — "can my company bid?"             → reference + deadline + status
     jobs      — "can I work here?"                → role spec + closing date
     forms     — "I need the paperwork"            → file, version, size

   Everything here is presentational seed data. The admin CMS in
   /admin already models most of these shapes and is the intended
   source once a backend exists.
   ═══════════════════════════════════════════════════════════════ */

/* ── Careers ───────────────────────────────────────────────── */
export type JobType = 'Full-time' | 'Fixed-term' | 'Internship'
export type Job = {
  id: string
  title: string
  department: string
  location: string
  type: JobType
  level: string
  posted: string
  closes: string
  summary: string
  responsibilities: string[]
  requirements: string[]
}

export const JOBS: Job[] = [
  {
    id: 'abr-2026-014',
    title: 'Relationship Officer — Micro Lending',
    department: 'Business',
    location: 'Musanze',
    type: 'Full-time',
    level: 'Officer',
    posted: '2026-07-14',
    closes: '2026-08-08',
    summary:
      'Grow and manage a portfolio of micro-entrepreneurs in the Northern Province, from first contact through disbursement and repayment follow-up.',
    responsibilities: [
      'Identify and appraise micro and small enterprise loan applicants in the branch catchment area',
      'Conduct on-site business assessments and prepare credit files for committee review',
      'Monitor portfolio quality and lead recovery action on arrears',
      'Cross-sell savings, bancassurance and eKash to existing borrowers',
    ],
    requirements: [
      "Bachelor's degree in Economics, Finance, Management or a related field",
      'At least 2 years in microfinance or SME lending in Rwanda',
      'Fluency in Kinyarwanda and English; French is an advantage',
      'Willingness to travel across the Northern Province',
    ],
  },
  {
    id: 'abr-2026-015',
    title: 'Digital Channels Engineer',
    department: 'IT & Digital',
    location: 'Kigali (HQ)',
    type: 'Full-time',
    level: 'Mid-level',
    posted: '2026-07-09',
    closes: '2026-08-01',
    summary:
      'Own the reliability and evolution of eKash (*540#) and AB IBAKWE, working across USSD, core-banking integrations and partner MNO APIs.',
    responsibilities: [
      'Maintain and extend USSD and mobile-money integration services',
      'Work with MTN and partner banks on interoperability and settlement issues',
      'Instrument channel availability and lead incident response for digital services',
      'Contribute to the API roadmap for third-party and agency banking partners',
    ],
    requirements: [
      "Bachelor's degree in Computer Science, Software Engineering or equivalent experience",
      '3+ years building or operating production financial services integrations',
      'Strong SQL and one of Java, C# or Python',
      'Exposure to core banking systems and ISO 8583 or equivalent messaging is an advantage',
    ],
  },
  {
    id: 'abr-2026-016',
    title: 'Compliance & AML Analyst',
    department: 'Risk & Compliance',
    location: 'Kigali (HQ)',
    type: 'Full-time',
    level: 'Officer',
    posted: '2026-07-02',
    closes: '2026-07-31',
    summary:
      'Support the Chief Risk Officer in meeting BNR regulatory obligations, with a focus on transaction monitoring, KYC quality and AML/CFT reporting.',
    responsibilities: [
      'Review transaction monitoring alerts and escalate suspicious activity reports',
      'Run periodic KYC remediation across the branch network',
      'Prepare regulatory returns and support BNR examinations',
      'Deliver AML/CFT refresher training to branch staff',
    ],
    requirements: [
      "Bachelor's degree in Law, Finance, Accounting or a related field",
      '2+ years in compliance, audit or risk within a regulated financial institution',
      'Working knowledge of BNR regulations and Rwandan AML/CFT law',
      'Professional certification (ACAMS, ICA) is an advantage',
    ],
  },
  {
    id: 'abr-2026-017',
    title: 'Branch Operations Assistant',
    department: 'Operations',
    location: 'Rubavu',
    type: 'Fixed-term',
    level: 'Entry',
    posted: '2026-06-25',
    closes: '2026-07-30',
    summary:
      'Front-line branch role covering teller duties, account opening and customer support for the Rubavu catchment area. Twelve-month contract with potential to convert.',
    responsibilities: [
      'Process deposits, withdrawals and transfers accurately and within service standards',
      'Open and maintain customer accounts, ensuring complete KYC documentation',
      'Resolve first-line customer queries and escalate as needed',
      'Support daily cash reconciliation and end-of-day balancing',
    ],
    requirements: [
      "Diploma or Bachelor's degree in a business-related field",
      'Prior cash-handling or customer service experience preferred',
      'Fluency in Kinyarwanda and English',
      'High attention to detail and a clean integrity record',
    ],
  },
  {
    id: 'abr-2026-018',
    title: 'Graduate Trainee Programme 2026',
    department: 'Human Resources',
    location: 'Kigali (HQ)',
    type: 'Internship',
    level: 'Graduate',
    posted: '2026-06-18',
    closes: '2026-08-15',
    summary:
      'A twelve-month rotational programme across credit, operations, risk and digital, designed for recent graduates starting a career in inclusive finance.',
    responsibilities: [
      'Complete four three-month rotations across core bank functions',
      'Deliver one improvement project per rotation with a named mentor',
      'Participate in structured training on credit analysis and banking operations',
    ],
    requirements: [
      "Bachelor's degree awarded in 2024 or later, upper second class or above",
      'Demonstrated interest in financial inclusion or SME development',
      'Strong analytical and written communication skills',
      'Rwandan nationality or valid right to work in Rwanda',
    ],
  },
]

/* ── Tenders ───────────────────────────────────────────────── */
export type TenderStatus = 'Open' | 'Closing soon' | 'Closed' | 'Awarded'
export type Tender = {
  id: string
  ref: string
  title: string
  category: string
  published: string
  deadline: string
  status: TenderStatus
  summary: string
  documents: { label: string; size: string }[]
}

export const TENDERS: Tender[] = [
  {
    id: 't-2026-09',
    ref: 'ABR/PROC/2026/09',
    title: 'Supply and Installation of Branch CCTV and Access Control',
    category: 'Security & Facilities',
    published: '2026-07-16',
    deadline: '2026-08-06',
    status: 'Open',
    summary:
      'AB Bank Rwanda Plc invites sealed bids from eligible firms for the supply, installation and three-year maintenance of CCTV and electronic access control across twelve branches and credit outlets.',
    documents: [
      { label: 'Tender document (RFP)', size: '1.8 MB' },
      { label: 'Bill of quantities', size: '240 KB' },
    ],
  },
  {
    id: 't-2026-08',
    ref: 'ABR/PROC/2026/08',
    title: 'Provision of External Audit Services (FY2026–FY2028)',
    category: 'Professional Services',
    published: '2026-07-03',
    deadline: '2026-07-31',
    status: 'Closing soon',
    summary:
      'Expressions of interest are invited from audit firms registered with ICPAR and approved by the National Bank of Rwanda to provide statutory external audit services for three financial years.',
    documents: [
      { label: 'Terms of reference', size: '620 KB' },
      { label: 'Bid submission form', size: '180 KB' },
    ],
  },
  {
    id: 't-2026-07',
    ref: 'ABR/PROC/2026/07',
    title: 'Supply of Branded Marketing Materials and Signage',
    category: 'Marketing & Print',
    published: '2026-06-11',
    deadline: '2026-07-04',
    status: 'Closed',
    summary:
      'Supply of branded stationery, branch signage, banners and campaign collateral for the 2026 financial year across the branch network.',
    documents: [{ label: 'Tender document (RFP)', size: '1.1 MB' }],
  },
  {
    id: 't-2026-05',
    ref: 'ABR/PROC/2026/05',
    title: 'Core Banking System Support and Maintenance',
    category: 'IT & Systems',
    published: '2026-04-22',
    deadline: '2026-05-20',
    status: 'Awarded',
    summary:
      'Annual support, maintenance and version upgrade services for the bank core banking platform, including 24/7 incident response and disaster recovery testing.',
    documents: [{ label: 'Award notice', size: '145 KB' }],
  },
]

/* ── Articles / Insights ───────────────────────────────────── */
export type Article = {
  id: string
  slug: string
  title: string
  topic: string
  excerpt: string
  author: string
  authorRole: string
  published: string
  readMins: number
  image: string
}

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    slug: 'five-signs-your-business-is-ready-for-a-loan',
    title: 'Five Signs Your Business Is Ready for Its First Loan',
    topic: 'SME Guidance',
    excerpt:
      'Borrowing too early is one of the most common reasons small businesses struggle with repayment. Here is how our credit officers assess readiness — and how you can assess it yourself before you apply.',
    author: 'Joas Ndikumana',
    authorRole: 'Chief Business Officer',
    published: '2026-07-18',
    readMins: 6,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 'a2',
    slug: 'understanding-interest-rates',
    title: 'Flat vs. Reducing Balance: What Your Interest Rate Actually Costs',
    topic: 'Financial Literacy',
    excerpt:
      'Two loans can advertise the same percentage and cost very different amounts. A plain-language walkthrough of how interest is calculated in Rwanda, with worked examples in RWF.',
    author: 'Celestin Karera',
    authorRole: 'Chief Finance Officer',
    published: '2026-07-04',
    readMins: 8,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 'a3',
    slug: 'protecting-yourself-from-mobile-money-fraud',
    title: 'Protecting Yourself From Mobile Money Fraud',
    topic: 'Security',
    excerpt:
      'AB Bank will never ask for your PIN. A practical guide to the six most common scams reported to our contact centre, and exactly what to do if you have already shared your details.',
    author: 'Joselyne Bivugire',
    authorRole: 'Chief Risk Officer',
    published: '2026-06-20',
    readMins: 5,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 'a4',
    slug: 'saving-for-the-agricultural-season',
    title: 'Saving Through the Agricultural Season',
    topic: 'Agriculture',
    excerpt:
      'Farming income arrives in bursts while costs run all year. How seasonal savings products and quarterly-repayment agro loans can smooth the gap for Rwandan smallholders.',
    author: 'AB Rwanda Agri Desk',
    authorRole: 'Agriculture Finance Team',
    published: '2026-06-06',
    readMins: 7,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 'a5',
    slug: 'women-entrepreneurs-access-to-credit',
    title: 'Closing the Credit Gap for Women Entrepreneurs',
    topic: 'Financial Inclusion',
    excerpt:
      'Women-led businesses in Rwanda are more likely to repay and less likely to be approved. What the data shows, and what the Umugore Savings programme is designed to change.',
    author: 'Dianne Dusaidi',
    authorRole: 'Board Chairperson',
    published: '2026-05-22',
    readMins: 9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=500&fit=crop&auto=format',
  },
]

/* ── Notices (regulatory / service) ────────────────────────── */
export type NoticeLevel = 'Information' | 'Important' | 'Urgent'
export type Notice = {
  id: string
  ref: string
  title: string
  level: NoticeLevel
  effective: string
  body: string
}

export const NOTICES: Notice[] = [
  {
    id: 'n-2026-06',
    ref: 'NOTICE/2026/06',
    title: 'Revised Tariff Guide Effective 1 September 2026',
    level: 'Important',
    effective: '2026-09-01',
    body: 'The revised schedule of fees and charges takes effect on 1 September 2026. The full tariff guide is available on the Forms & Downloads page and at every branch. Customers who do not wish to continue under the revised terms may close their accounts free of charge before that date.',
  },
  {
    id: 'n-2026-05',
    ref: 'NOTICE/2026/05',
    title: 'Scheduled Core Banking Maintenance — 2 August 2026',
    level: 'Information',
    effective: '2026-08-02',
    body: 'eKash (*540#), AB IBAKWE and card services will be unavailable from 23:00 on Saturday 2 August to 04:00 on Sunday 3 August while we complete a scheduled system upgrade. Branch services are unaffected.',
  },
  {
    id: 'n-2026-04',
    ref: 'NOTICE/2026/04',
    title: 'Dormant Account Reactivation Notice',
    level: 'Important',
    effective: '2026-07-15',
    body: 'Accounts with no customer-initiated activity for 24 months have been classified as dormant in line with BNR directives. Holders may reactivate at any branch with a valid national ID at no charge.',
  },
  {
    id: 'n-2026-03',
    ref: 'NOTICE/2026/03',
    title: 'Public Warning: Fraudulent Loan Offers Using the AB Bank Name',
    level: 'Urgent',
    effective: '2026-06-28',
    body: 'We are aware of individuals contacting the public via WhatsApp and SMS offering AB Bank loans in exchange for an advance "processing fee". AB Bank Rwanda never requests payment before disbursement and never asks for your PIN. Report any such contact to 5500.',
  },
]

/* ── Forms & downloads ─────────────────────────────────────── */
export type FormDoc = {
  id: string
  title: string
  category: string
  description: string
  fileType: 'PDF' | 'DOCX' | 'XLSX'
  size: string
  updated: string
}

export const FORM_CATEGORIES = [
  'Account Opening',
  'Loans',
  'Bancassurance',
  'Digital & Cards',
  'Tariffs & Terms',
  'Financial Statements',
] as const

export const FORMS: FormDoc[] = [
  {
    id: 'f1',
    title: 'Individual Account Opening Form',
    category: 'Account Opening',
    description: 'For personal savings, current and IGIRE term deposit accounts. Bring a valid national ID or passport.',
    fileType: 'PDF',
    size: '480 KB',
    updated: '2026-05-12',
  },
  {
    id: 'f2',
    title: 'Business & Entity Account Opening Form',
    category: 'Account Opening',
    description: 'For companies, cooperatives and associations. Requires RDB registration and a board resolution.',
    fileType: 'PDF',
    size: '640 KB',
    updated: '2026-05-12',
  },
  {
    id: 'f3',
    title: 'KYC Update / Customer Records Amendment',
    category: 'Account Opening',
    description: 'Use to update your name, address, phone number, ID document or signature on record.',
    fileType: 'PDF',
    size: '210 KB',
    updated: '2026-03-30',
  },
  {
    id: 'f4',
    title: 'Micro & Super Micro Loan Application',
    category: 'Loans',
    description: 'Application pack for loans from RWF 200,000 to 30,000,000, including the business appraisal annex.',
    fileType: 'PDF',
    size: '820 KB',
    updated: '2026-06-02',
  },
  {
    id: 'f5',
    title: 'Agro Loan Application',
    category: 'Loans',
    description: 'For agricultural and agri-value-chain financing with quarterly or biannual repayment schedules.',
    fileType: 'PDF',
    size: '560 KB',
    updated: '2026-06-02',
  },
  {
    id: 'f6',
    title: 'Loan Repayment Schedule Calculator',
    category: 'Loans',
    description: 'Spreadsheet to model repayments on reducing-balance terms before you apply.',
    fileType: 'XLSX',
    size: '95 KB',
    updated: '2026-04-18',
  },
  {
    id: 'f7',
    title: 'NGOBOKA Enrolment Form — Individual',
    category: 'Bancassurance',
    description: 'Life cover from RWF 400 per month, underwritten by Sanlam Vie.',
    fileType: 'PDF',
    size: '390 KB',
    updated: '2026-02-14',
  },
  {
    id: 'f8',
    title: 'NGOBOKA Enrolment Form — Family',
    category: 'Bancassurance',
    description: 'Covers spouse and up to four children to age 25, from RWF 900 per month.',
    fileType: 'PDF',
    size: '410 KB',
    updated: '2026-02-14',
  },
  {
    id: 'f9',
    title: 'eKash & AB IBAKWE Registration Form',
    category: 'Digital & Cards',
    description: 'Register a phone number for USSD banking on *540# and MTN MoMo push/pull on *182*4#.',
    fileType: 'PDF',
    size: '265 KB',
    updated: '2026-05-28',
  },
  {
    id: 'f10',
    title: 'Debit Card Request & Dispute Form',
    category: 'Digital & Cards',
    description: 'Request, replace or block a card, and raise a disputed card transaction.',
    fileType: 'PDF',
    size: '300 KB',
    updated: '2026-05-28',
  },
  {
    id: 'f11',
    title: 'Tariff Guide 2026',
    category: 'Tariffs & Terms',
    description: 'Full schedule of fees and charges across all products. Revised edition effective 1 September 2026.',
    fileType: 'PDF',
    size: '1.2 MB',
    updated: '2026-07-15',
  },
  {
    id: 'f12',
    title: 'General Terms & Conditions of Account',
    category: 'Tariffs & Terms',
    description: 'The contractual terms governing all AB Bank Rwanda deposit accounts.',
    fileType: 'PDF',
    size: '740 KB',
    updated: '2026-01-20',
  },
  {
    id: 'f13',
    title: 'Data Privacy Notice',
    category: 'Tariffs & Terms',
    description: 'How we collect, use and protect personal data under Rwandan data protection law.',
    fileType: 'PDF',
    size: '320 KB',
    updated: '2026-01-20',
  },
  {
    id: 'f14',
    title: 'Audited Financial Statements — FY2025',
    category: 'Financial Statements',
    description: 'Statement of financial position, comprehensive income and the independent auditor report.',
    fileType: 'PDF',
    size: '2.4 MB',
    updated: '2026-04-05',
  },
  {
    id: 'f15',
    title: 'Quarterly Disclosure — Q1 2026',
    category: 'Financial Statements',
    description: 'Published in line with National Bank of Rwanda public disclosure requirements.',
    fileType: 'PDF',
    size: '880 KB',
    updated: '2026-05-10',
  },
]

/* ── Helpers ───────────────────────────────────────────────── */
export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Whole days from today until `iso`. Negative once the date has passed. */
export function daysUntil(iso: string) {
  const target = new Date(iso + 'T00:00:00').getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today.getTime()) / 86_400_000)
}

/* ── Employee awards ───────────────────────────────────────
   Recognition programme content. Two cadences that are judged
   differently and so are modelled differently:

     Employee of the Month — one winner per month, peer + manager
       nominated, cited for a specific act in that month.
     Employee of the Year   — one winner per year, drawn from the
       twelve monthly winners, cited for sustained impact and
       backed by measurable results.
   ─────────────────────────────────────────────────────────── */
export type Award = {
  id: string
  period: string
  periodShort: string
  name: string
  role: string
  branch: string
  department: string
  photo: string
  citation: string
  quote: string
  metrics: { value: string; label: string }[]
}

export const EMPLOYEE_OF_THE_YEAR: Award = {
  id: 'eoy-2025',
  period: '2025',
  periodShort: 'FY2025',
  name: 'Immaculée Mukamana',
  role: 'Branch Manager',
  branch: 'Musanze',
  department: 'Business',
  photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=900&fit=crop&auto=format',
  citation:
    'Immaculée took the Musanze branch from the smallest upcountry portfolio to the strongest in the network in a single financial year — without a single write-off. She rebuilt the branch appraisal routine around on-site visits, trained four new relationship officers herself, and personally reworked the repayment schedules of 60 agri-borrowers so instalments landed after harvest rather than before it.',
  quote:
    'You cannot assess a farmer from behind a desk in town. Go to the field, count what is actually growing, then decide. The numbers follow the respect.',
  metrics: [
    { value: '+38%', label: 'Portfolio growth' },
    { value: '0.4%', label: 'Portfolio at risk' },
    { value: '612', label: 'New borrowers' },
    { value: '4', label: 'Officers mentored' },
  ],
}

export const EMPLOYEE_OF_THE_MONTH: Award = {
  id: 'eom-2026-07',
  period: 'July 2026',
  periodShort: 'Jul 2026',
  name: 'Jean-Paul Habimana',
  role: 'Digital Channels Engineer',
  branch: 'Kigali (HQ)',
  department: 'IT & Digital',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&auto=format',
  citation:
    'When the MTN settlement file format changed without notice on a Saturday night, Jean-Paul traced the failure, wrote the parser fix and had eKash reconciling again before the Sunday morning agent float run. Customers never saw an outage. He then wrote the runbook so the next person would not need to be him.',
  quote:
    'Nobody dials *540# thinking about integrations. They think about sending school fees. That is the job.',
  metrics: [
    { value: '3h 40m', label: 'Time to resolution' },
    { value: '0', label: 'Customer-facing downtime' },
    { value: '52k', label: 'Transactions protected' },
  ],
}

export type PastAward = {
  id: string
  period: string
  name: string
  role: string
  branch: string
  reason: string
}

export const PAST_MONTHLY: PastAward[] = [
  {
    id: 'eom-2026-06',
    period: 'June 2026',
    name: 'Aline Uwimana',
    role: 'Customer Service Officer',
    branch: 'Nyabugogo',
    reason: 'Handled 41 walk-ins during the tariff transition without a single escalation.',
  },
  {
    id: 'eom-2026-05',
    period: 'May 2026',
    name: 'Eric Nsengiyumva',
    role: 'Relationship Officer',
    branch: 'Rwamagana',
    reason: 'Recovered RWF 18M of arrears through renegotiation rather than enforcement.',
  },
  {
    id: 'eom-2026-04',
    period: 'April 2026',
    name: 'Claudine Ingabire',
    role: 'Teller',
    branch: 'Huye',
    reason: 'Spotted and stopped an attempted identity fraud at the counter.',
  },
  {
    id: 'eom-2026-03',
    period: 'March 2026',
    name: 'Patrick Rwigema',
    role: 'Credit Analyst',
    branch: 'Kigali (HQ)',
    reason: 'Cut average micro-loan appraisal turnaround from 4.2 days to 2.6.',
  },
  {
    id: 'eom-2026-02',
    period: 'February 2026',
    name: 'Solange Mutesi',
    role: 'Bancassurance Officer',
    branch: 'Rubavu',
    reason: 'Enrolled 220 families in NGOBOKA cover in a single month.',
  },
  {
    id: 'eom-2026-01',
    period: 'January 2026',
    name: 'Fabrice Bizimana',
    role: 'Agri Loan Officer',
    branch: 'Nyagatare',
    reason: 'Restructured 90 seasonal loans ahead of an unusually late rainy season.',
  },
]

export const AWARD_CRITERIA = [
  {
    title: 'Customer outcome',
    body: 'Did a real customer end up materially better off? Volume alone does not qualify anyone.',
  },
  {
    title: 'SMART in practice',
    body: 'Simple, Meaningful, Appropriate, Responsive, Transparent — demonstrated, not recited.',
  },
  {
    title: 'Lifting the team',
    body: 'Work that made colleagues better at their jobs counts as much as individual numbers.',
  },
  {
    title: 'Integrity under pressure',
    body: 'The decision that was harder but right, especially when nobody was watching.',
  },
]
