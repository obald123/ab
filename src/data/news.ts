/* Bundled brand artwork stands in for photos until the CMS responds — no
   third-party image host is contacted on page load. */
import FALLBACK_ART from '../imports/story/story-photo.webp'

export interface NewsRelease {
  id: string
  category: string
  tag: string
  createdAt?: string
  title: string
  excerpt: string
  body?: string
  image: string
  featured?: boolean
}

/** Used while the CMS is loading and if the public API is unavailable. */
export const FALLBACK_PRESS: NewsRelease[] = [
  {
    id: 'p1',
    category: 'Bancassurance',
    tag: 'New Product',
    createdAt: '2026-07-12T09:00:00+02:00',
    title: 'NGOBOKA Life Insurance Now Available at All AB BANK PLC Branches',
    excerpt:
      'In partnership with Sanlam Vie, AB BANK PLC launches NGOBOKA — an accessible life insurance scheme offering individual coverage from RWF 400/month and family protection for spouse and up to four children from RWF 900/month.',
    image: FALLBACK_ART,
  },
  {
    id: 'p2',
    category: 'Digital',
    tag: 'Milestone',
    createdAt: '2026-05-30T09:00:00+02:00',
    title: 'E-kash Surpasses 50,000 Active Users Across All Networks',
    excerpt:
      'Our digital payment platform E-kash — accessible via *540# — now covers all major mobile network operators and partner banks, bringing seamless mobile banking to every corner of Rwanda.',
    image: FALLBACK_ART,
  },
  {
    id: 'p3',
    category: 'Network',
    tag: 'Expansion',
    createdAt: '2026-04-08T09:00:00+02:00',
    title: 'AB BANK PLC Opens Its 47th Service Point in Ngoma',
    excerpt:
      'The new credit outlet extends the bank network deeper into the Eastern Province, serving agri-businesses and traders across the Ngoma catchment area.',
    image: FALLBACK_ART,
  },
  {
    id: 'p4',
    category: 'Corporate',
    tag: 'Results',
    createdAt: '2026-04-05T09:00:00+02:00',
    title: 'AB BANK PLC Publishes Audited FY2025 Financial Statements',
    excerpt:
      'The bank reports continued portfolio growth and improved asset quality for the financial year ended 31 December 2025. Full statements are available on the Forms & Downloads page.',
    image: FALLBACK_ART,
  },
]