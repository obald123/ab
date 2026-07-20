import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Branch = { name: string; addr: string; lat: number; lng: number; isHQ?: boolean }

// Approximate coordinates (city/town centers) — one-time hardcoded values
const branches: Branch[] = [
  { name: 'Nyarugenge (HQ)', addr: 'BCK Building, KN 78 St, Kigali Town', lat: -1.9441, lng: 30.0619, isHQ: true },
  { name: 'Gisozi', addr: 'APARWA Building, KG 33 Ave, Gakinjiro', lat: -1.929, lng: 30.064 },
  { name: 'Musanze', addr: 'Nova Market Complex, Musanze Town', lat: -1.504, lng: 29.632 },
  { name: 'Kimironko', addr: 'Kimironko Market area, Kigali', lat: -1.943, lng: 30.083 },
  { name: 'Nyabugogo', addr: 'Nyabugogo Bus Park area, Kigali', lat: -1.979, lng: 30.085 },
  { name: 'Gicumbi', addr: 'Gicumbi Town', lat: -1.583, lng: 30.051 },
  { name: 'Karongi', addr: 'Karongi Town', lat: -2.070, lng: 29.046 },
  { name: 'Huye', addr: 'Huye Town', lat: -2.607, lng: 29.739 },
  { name: 'Kabarondo', addr: 'Kabarondo Town', lat: -2.063, lng: 30.345 },
  { name: 'Rwamagana', addr: 'Rwamagana Town', lat: -1.945, lng: 30.434 },
  { name: 'Gatsibo', addr: 'Gatsibo Town', lat: -1.619, lng: 30.567 },
  { name: 'Muhanga', addr: 'Muhanga Town', lat: -2.102, lng: 29.756 },
  { name: 'Nyagatare', addr: 'Nyagatare Town', lat: -1.291, lng: 30.329 },
  { name: 'Nyamagabe', addr: 'Nyamagabe Town', lat: -2.488, lng: 29.397 },
  { name: 'Nyamata', addr: 'Nyamata Town', lat: -2.005, lng: 30.238 },
  { name: 'Nyanza', addr: 'Nyanza Town', lat: -2.351, lng: 29.745 },
  { name: 'Rubavu', addr: 'Rubavu Town', lat: -1.710, lng: 29.276 },
  { name: 'Rusizi', addr: 'Rusizi (Kamembe)', lat: -2.478, lng: 28.860 },
  { name: 'Rulindo', addr: 'Rulindo Town', lat: -1.678, lng: 29.764 },
  { name: 'Nyabihu', addr: 'Nyabihu Town', lat: -1.567, lng: 29.546 },
  { name: 'Kirehe', addr: 'Kirehe Town', lat: -2.024, lng: 30.666 },
  { name: 'Nyamasheke', addr: 'Nyamasheke Town', lat: -2.463, lng: 29.121 },
  { name: 'Rutsiro', addr: 'Rutsiro Town', lat: -1.806, lng: 29.343 },
  { name: 'Burera', addr: 'Burera Town', lat: -1.482, lng: 29.776 },
  { name: 'Ngoma', addr: 'Ngoma Town', lat: -2.103, lng: 30.183 },
]

export default function Branches() {
  // center roughly on Rwanda
  const center: [number, number] = [-1.95, 30.06]
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    const map = L.map(mapRef.current, { center, zoom: 8 })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    // prepare custom icons (serve from src/imports so Vite will serve them)
    const blueIcon = L.icon({ iconUrl: '/src/imports/icons/pin-blue.svg', iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -36] })
    const greyIcon = L.icon({ iconUrl: '/src/imports/icons/pin-grey.svg', iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -36] })

    branches.forEach((b) => {
      const icon = b.isHQ ? greyIcon : blueIcon
      const marker = L.marker([b.lat, b.lng], { icon }).addTo(map)

      // try to show a local image on hover/popup if available
      const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const imageUrl = `/src/imports/branches/${slug}.jpg`
      let popupContent = `<div style="font-weight:700">${b.name}</div><div style="font-size:13px">${b.addr}</div>`

      const img = new Image()
      img.onload = () => {
        const html = `<div style=\"display:flex;gap:12px;align-items:center\"><img src=\"${imageUrl}\" alt=\"${b.name}\" style=\"width:120px;height:80px;object-fit:cover;border-radius:8px;\"/><div><div style=\"font-weight:700\">${b.name}</div><div style=\"font-size:13px\">${b.addr}</div></div></div>`
        marker.bindPopup(html)
      }
      img.onerror = () => {
        marker.bindPopup(popupContent)
      }
      // start loading; browser will fetch if file exists
      img.src = imageUrl

      // open popup on hover for quick preview, close on mouseout
      marker.on('mouseover', () => marker.openPopup())
      marker.on('mouseout', () => marker.closePopup())
    })

    return () => {
      map.remove()
    }
  }, [])

  return (
    <section id="branches" style={{ padding: '48px 0', background: '#f6fbff' }}>
      <div style={{ margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <span className="section-pill">Locations</span>
          <h2 style={{ fontWeight: 900, fontSize: 28, color: '#0284c7' }}>Our Branch Network</h2>
          <p style={{ color: '#647080', marginTop: 8 }}>Interactive map showing all branch locations. Click a marker for details.</p>
        </div>

        <div ref={mapRef as any} style={{ width: '100%', height: 520, borderRadius: 12, overflow: 'hidden' }} />
      </div>
    </section>
  )
}
