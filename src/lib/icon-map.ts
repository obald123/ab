import {
  IconBank,
  IconBriefcase,
  IconBulb,
  IconCalculator,
  IconCalendar,
  IconCar,
  IconChart,
  IconCheck,
  IconClock,
  IconCoin,
  IconCreditCard,
  IconExchange,
  IconGift,
  IconGlobe,
  IconGraduate,
  IconGrid,
  IconHandshake,
  IconHeart,
  IconHome,
  IconLeaf,
  IconMapPin,
  IconMobile,
  IconNews,
  IconPen,
  IconPercent,
  IconSend,
  IconShield,
  IconStar,
  IconTrendUp,
  IconUsers,
  IconZap,
} from '../components/Icons'

/* The CMS stores an icon *name*; the components need a component. This is the
   one place that translation happens, so an editor typing an unknown name gets
   a sensible default instead of a blank space or a crash. */

export type IconComponent = React.FC<{ size?: number; color?: string; strokeWidth?: number }>

const ICONS: Record<string, IconComponent> = {
  bank: IconBank,
  briefcase: IconBriefcase,
  bulb: IconBulb,
  calculator: IconCalculator,
  calendar: IconCalendar,
  car: IconCar,
  chart: IconChart,
  check: IconCheck,
  clock: IconClock,
  coin: IconCoin,
  'credit-card': IconCreditCard,
  exchange: IconExchange,
  gift: IconGift,
  globe: IconGlobe,
  graduate: IconGraduate,
  grid: IconGrid,
  handshake: IconHandshake,
  heart: IconHeart,
  home: IconHome,
  leaf: IconLeaf,
  'map-pin': IconMapPin,
  mobile: IconMobile,
  news: IconNews,
  pen: IconPen,
  percent: IconPercent,
  send: IconSend,
  shield: IconShield,
  star: IconStar,
  'trend-up': IconTrendUp,
  users: IconUsers,
  zap: IconZap,
}

export function iconFor(name: string | undefined, fallback: IconComponent = IconStar): IconComponent {
  if (!name) return fallback
  return ICONS[name.trim().toLowerCase()] ?? fallback
}
