import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { IconMapPin } from './Icons'
import pinBlueUrl from '../imports/icons/pin-blue.svg'
import pinGreyUrl from '../imports/icons/pin-grey.svg'
import { useCollection } from '../lib/content'

/* ══════════════════════════════════════════════
   Branch data — sourced from abr.rw/our-branches/
   Coordinates are approximate town/city centers.
   The site publishes one central line for all
   locations (no per-branch phone numbers), so
   every marker shares the same bank contact.
══════════════════════════════════════════════ */
const BANK_CONTACT = {
  phone: '+250 788 198 300',
  phoneHref: 'tel:+250788198300',
  whatsapp: '+250 788 319 108',
  whatsappHref: 'https://wa.me/250788319108',
  email: 'info@abr.rw',
}

/** What the CMS stores for a branch. */
interface CmsBranch {
  name: string
  addr: string
  lat: number
  lng: number
  isHQ: boolean
}

/* `kind` and `hours` are display-only and not modelled in the CMS, so they are
   derived rather than authored: HQ and named branches keep branch hours,
   credit outlets close on Saturdays. */
type Branch = CmsBranch & {
  kind: 'Branch' | 'Credit Outlet'
  hours: string
}

const BRANCH_HOURS = 'Mon–Fri 9am–5pm · Sat 9am–1pm'
const OUTLET_HOURS = 'Mon–Fri 9am–5pm'

/** Shown only until the CMS responds, and if it never does. */
const FALLBACK: Branch[] = [
  { name: 'Nyarugenge (HQ)', addr: 'BCK Building, KN 78 St, Kigali Town', lat: -1.9441, lng: 30.0619, isHQ: true, kind: 'Branch', hours: BRANCH_HOURS },
  { name: 'Gisozi', addr: 'APARWA Building, KG 33 Ave, Gakinjiro', lat: -1.929, lng: 30.064, isHQ: false, kind: 'Branch', hours: BRANCH_HOURS },
  { name: 'Musanze', addr: 'Nova Market Complex, NM 11 St, Musanze Town', lat: -1.504, lng: 29.632, isHQ: false, kind: 'Branch', hours: BRANCH_HOURS },
  { name: 'Kimironko', addr: 'House No 93, KG 11 Ave, near Kimironko & Kibagabaga junction', lat: -1.943, lng: 30.083, isHQ: false, kind: 'Branch', hours: BRANCH_HOURS },
  { name: 'Nyabugogo', addr: 'Inkundamahoro Building, KN 20 Ave', lat: -1.979, lng: 30.085, isHQ: false, kind: 'Branch', hours: BRANCH_HOURS },
  { name: 'Gicumbi', addr: 'GANA House, Gicumbi Town, near 7th Day Adventist Church, opposite ENGEN Station', lat: -1.583, lng: 30.051, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Karongi', addr: 'Building opposite Hotel Kivu Plazza (Floor 2), Karongi Town', lat: -2.070, lng: 29.046, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Huye', addr: 'INTASHYA House, opposite Rubis Station', lat: -2.607, lng: 29.739, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Kabarondo', addr: 'Opposite Kabarondo Market', lat: -2.063, lng: 30.345, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Rwamagana', addr: 'Building opposite MEREZ Station (Floor 1), Rwamagana Town', lat: -1.945, lng: 30.434, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Gatsibo', addr: 'Cactus Hotel Building (Ground Floor), Kabarore Sector', lat: -1.619, lng: 30.567, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Muhanga', addr: 'Commercial Complex House, near ADEPER Gahogo', lat: -2.102, lng: 29.756, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Nyagatare', addr: 'Opposite Rapha Clinic, EN 14 Ave, Nyagatare Town', lat: -1.291, lng: 30.329, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Nyamagabe', addr: 'Kanimba Building (Floor 1), Nyamagabe Town', lat: -2.488, lng: 29.397, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Nyamata', addr: 'Ndahiro Building (Floor 2), opposite the market, Nyamata Town', lat: -2.005, lng: 30.238, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Nyanza', addr: 'Rubangura House (Floor 1), opposite Nyanza Market', lat: -2.351, lng: 29.745, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Rubavu', addr: 'Ubuntu House, main avenue, Rubavu Town', lat: -1.710, lng: 29.276, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Rusizi', addr: 'Former COGEBANQUE Building (Ground floor), Kamembe Town', lat: -2.478, lng: 28.860, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Rulindo', addr: 'Near Base Market, opposite BPR', lat: -1.678, lng: 29.764, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Nyabihu', addr: 'Kora Sector, next to BK/Kora Branch', lat: -1.567, lng: 29.546, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Kirehe', addr: 'Opposite BARAKA Medical Clinic', lat: -2.024, lng: 30.666, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Nyamasheke', addr: 'Tyazo Sector, opposite the taxi park', lat: -2.463, lng: 29.121, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Rutsiro', addr: 'Congo Nil Cell, Gihango Sector, near the district building', lat: -1.806, lng: 29.343, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Burera', addr: 'Rusumo Sector, opposite BK Burera Branch', lat: -1.482, lng: 29.776, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
  { name: 'Ngoma', addr: 'Ngoma District, opposite the market', lat: -2.103, lng: 30.183, isHQ: false, kind: 'Credit Outlet', hours: OUTLET_HOURS },
]

/* Inline SVG icons for the Leaflet popup — Leaflet takes an HTML string, so
   these mirror the stroke style of the shared <Icons /> set as raw markup. */
function svgIcon(paths: string, color = '#0ea5e9', size = 13) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px">${paths}</svg>`
}

const ICON_PATHS = {
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
}

function popupHtml(b: Branch) {
  const badgeColor = b.isHQ ? '#647080' : '#0ea5e9'
  const row = (icon: string, content: string, color = '#647080') =>
    `<div style="display:flex;align-items:flex-start;gap:7px;color:${color}">${icon}<span>${content}</span></div>`

  return `
    <div style="font-family:inherit;min-width:220px;padding:2px 2px 4px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="display:inline-block;padding:2px 9px;border-radius:999px;background:${badgeColor}1a;color:${badgeColor};font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase">${b.isHQ ? 'Headquarters' : b.kind}</span>
      </div>
      <div style="font-weight:800;font-size:14.5px;color:#0284c7;margin-bottom:6px">${b.name}</div>
      <div style="font-size:12.5px;line-height:1.5;margin-bottom:6px">
        ${row(svgIcon(ICON_PATHS.pin, '#94a3b8'), b.addr)}
      </div>
      <div style="font-size:11.5px;font-weight:700;margin-bottom:8px">
        ${row(svgIcon(ICON_PATHS.clock), b.hours, '#0ea5e9')}
      </div>
      <div style="border-top:1px solid rgba(14,165,233,0.15);padding-top:8px;font-size:12px;line-height:1.7;display:flex;flex-direction:column;gap:4px">
        ${row(svgIcon(ICON_PATHS.phone), `<a href="${BANK_CONTACT.phoneHref}" style="color:#0284c7;font-weight:700;text-decoration:none">${BANK_CONTACT.phone}</a>`)}
        ${row(svgIcon(ICON_PATHS.mail), `<a href="mailto:${BANK_CONTACT.email}" style="color:#0284c7;font-weight:700;text-decoration:none">${BANK_CONTACT.email}</a>`)}
      </div>
    </div>
  `
}

export default function Branches() {
  // center roughly on Rwanda
  const center: [number, number] = [-1.95, 30.06]
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState<Branch | null>(null)

  const { data: cmsBranches } = useCollection<CmsBranch>('branch', FALLBACK)

  /* The CMS does not model opening hours or the branch/outlet distinction, so
     those are filled in here. A branch named "(HQ)" or flagged isHQ keeps full
     branch hours; everything else is treated as a credit outlet. */
  const branches: Branch[] = useMemo(
    () =>
      cmsBranches.map((b) => {
        const isBranch = b.isHQ || /\(HQ\)|Branch$/i.test(b.name)
        return {
          ...b,
          kind: isBranch ? 'Branch' : 'Credit Outlet',
          hours: isBranch ? BRANCH_HOURS : OUTLET_HOURS,
        }
      }),
    [cmsBranches],
  )

  useEffect(() => {
    if (!mapRef.current) return
    const map = L.map(mapRef.current, { center, zoom: 8, scrollWheelZoom: false })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    // Bundled SVG icons (imported as URLs so they survive the production build)
    const blueIcon = L.icon({ iconUrl: pinBlueUrl, iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -32] })
    const greyIcon = L.icon({ iconUrl: pinGreyUrl, iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -32] })

    branches.forEach((b) => {
      const icon = b.isHQ ? greyIcon : blueIcon
      const marker = L.marker([b.lat, b.lng], { icon, riseOnHover: true }).addTo(map)
      marker.bindPopup(popupHtml(b), { closeButton: false, maxWidth: 260 })

      marker.on('mouseover', () => { marker.openPopup(); setHovered(b) })
      marker.on('mouseout', () => { marker.closePopup(); setHovered(null) })
      marker.on('click', () => setHovered(b))
    })

    return () => {
      map.remove()
    }
    // Rebuilt when CMS branches arrive so the markers match the list below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches])

  return (
    <section id="branches" style={{ padding: '64px 0', background: '#f6fbff' }}>
      <div style={{ margin: '0 auto', padding: '0 48px', maxWidth: 1400 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <span className="section-pill section-pill--icon"><IconMapPin size={14} strokeWidth={2} color="#0ea5e9" />Locations</span>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#0284c7', letterSpacing: '-0.02em' }}>Our Branch Network</h2>
          <p style={{ color: '#647080', marginTop: 8, maxWidth: 560, marginInline: 'auto' }}>
            {branches.length} branches and credit outlets across Rwanda. Hover a marker to see the branch name, address and contact details.
          </p>
        </motion.div>

        {/* Map — inset with side gutters so it doesn't run edge-to-edge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{
            padding: '0 clamp(4px, 3vw, 56px)',
          }}
        >
          <div style={{
            position: 'relative',
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid rgba(14,165,233,0.14)',
            boxShadow: '0 24px 60px rgba(14,165,233,0.12)',
          }}>
            <div ref={mapRef as any} style={{ width: '100%', height: 480 }} />

            {/* Hovered branch info card */}
            <div style={{
              position: 'absolute', top: 14, left: 14, zIndex: 500,
              maxWidth: 260,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: 'none',
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(10px)',
              borderRadius: 14,
              padding: '14px 16px',
              boxShadow: '0 12px 32px rgba(2,30,60,0.18)',
              border: '1px solid rgba(14,165,233,0.14)',
            }}>
              {hovered && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <IconMapPin size={12} color={hovered.isHQ ? '#647080' : '#0ea5e9'} strokeWidth={2.2} />
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: hovered.isHQ ? '#647080' : '#0ea5e9' }}>
                      {hovered.isHQ ? 'Headquarters' : hovered.kind}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0284c7', marginBottom: 4 }}>{hovered.name}</div>
                  <div style={{ fontSize: 12, color: '#647080', lineHeight: 1.5, marginBottom: 6 }}>{hovered.addr}</div>
                  <div style={{ fontSize: 11.5, color: '#647080' }}>{BANK_CONTACT.phone}</div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
