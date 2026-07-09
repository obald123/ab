type IconProps = { size?: number; color?: string; strokeWidth?: number; className?: string }
const D = ({ size = 24, color = 'currentColor', strokeWidth = 1.75, className = '', children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
)

export const IconMobile     = (p: IconProps) => <D {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill={p.color||'currentColor'} stroke="none"/></D>
export const IconBuilding   = (p: IconProps) => <D {...p}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 22V12h6v10"/><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M15 11h.01"/></D>
export const IconHeart      = (p: IconProps) => <D {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></D>
export const IconMapPin     = (p: IconProps) => <D {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></D>
export const IconCalculator = (p: IconProps) => <D {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h8"/></D>
export const IconExchange   = (p: IconProps) => <D {...p}><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/></D>
export const IconPen        = (p: IconProps) => <D {...p}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></D>
export const IconGift       = (p: IconProps) => <D {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></D>
export const IconTrendUp    = (p: IconProps) => <D {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></D>
export const IconGlobe      = (p: IconProps) => <D {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></D>
export const IconStar       = (p: IconProps) => <D {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></D>
export const IconBank       = (p: IconProps) => <D {...p}><path d="M3 22h18M3 10h18M5 6l7-4 7 4M4 10v12M20 10v12M8 10v12M12 10v12M16 10v12"/></D>
export const IconMap        = (p: IconProps) => <D {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></D>
export const IconLeaf       = (p: IconProps) => <D {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></D>
export const IconCpu        = (p: IconProps) => <D {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></D>
export const IconZap        = (p: IconProps) => <D {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></D>
export const IconCalendar   = (p: IconProps) => <D {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></D>
export const IconCoin       = (p: IconProps) => <D {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v2M12 16v2M9 9.5h4a1.5 1.5 0 0 1 0 3H11a1.5 1.5 0 0 0 0 3h4"/></D>
export const IconCreditCard = (p: IconProps) => <D {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></D>
export const IconChart      = (p: IconProps) => <D {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/></D>
export const IconBriefcase  = (p: IconProps) => <D {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/><path d="M2 12h20"/></D>
export const IconHandshake  = (p: IconProps) => <D {...p}><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.5 1.5L12 21l6.92-6.92 1.5-1.5a5.4 5.4 0 0 0 0-7.65z"/></D>
export const IconHome       = (p: IconProps) => <D {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></D>
export const IconCar        = (p: IconProps) => <D {...p}><path d="M5 17H3a2 2 0 0 1-2-2V9l3-5h14l3 5v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 9h14"/></D>
export const IconGraduate   = (p: IconProps) => <D {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></D>
export const IconBulb       = (p: IconProps) => <D {...p}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></D>
export const IconShield     = (p: IconProps) => <D {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></D>
export const IconUsers      = (p: IconProps) => <D {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></D>
export const IconCheck      = (p: IconProps) => <D {...p}><polyline points="20 6 9 17 4 12"/></D>
export const IconCheckCircle = (p: IconProps) => <D {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></D>
export const IconSend       = (p: IconProps) => <D {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></D>
export const IconNetwork    = (p: IconProps) => <D {...p}><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M12 8v3M8.5 17l-3 0M19 16v-3M12 11l-3.5 6M12 11l3.5 6"/></D>
export const IconPercent    = (p: IconProps) => <D {...p}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></D>
export const IconClock      = (p: IconProps) => <D {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></D>
