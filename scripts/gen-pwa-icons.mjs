/* Regenerate the PWA icon set from the brand logo.
 *
 *   node scripts/gen-pwa-icons.mjs
 *
 * The Frontend has no image tooling of its own, so this borrows `sharp` from
 * the sibling `backend/` package. Output overwrites Frontend/public/icons/*,
 * public/apple-touch-icon.png and public/favicon.ico.
 *
 * The source logo is wide (~3.4:1), so every icon is that logo centred on a
 * white ground (matching the manifest `background_color`), with extra padding
 * on the maskable variant so it survives the 80% safe-zone crop.
 */
import { createRequire } from 'node:module'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(here, '..')
const require = createRequire(path.join(FRONTEND, '..', 'backend', 'package.json'))
const sharp = require('sharp')

const SRC_LOGO = path.join(FRONTEND, 'src/imports/logo1-transparent.png')
const PUBLIC = path.join(FRONTEND, 'public')
const ICONS = path.join(PUBLIC, 'icons')
mkdirSync(ICONS, { recursive: true })

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

/** Square canvas, white ground, logo centred at `logoWidth` px wide. */
async function squareIcon(size, logoWidth) {
  const logo = await sharp(SRC_LOGO).resize({ width: Math.round(logoWidth), fit: 'inside' }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toBuffer()
}

/** Minimal ICO container wrapping one PNG (PNG-in-ICO is read by every current browser). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(1, 4) // count
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0)
  entry.writeUInt8(size >= 256 ? 0 : size, 1)
  entry.writeUInt16LE(1, 4) // planes
  entry.writeUInt16LE(32, 6) // bpp
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(22, 12) // offset = 6 + 16
  return Buffer.concat([header, entry, png])
}

const jobs = [
  { file: path.join(ICONS, 'pwa-192.png'), size: 192, logo: 160 },
  { file: path.join(ICONS, 'pwa-512.png'), size: 512, logo: 432 },
  { file: path.join(ICONS, 'maskable-512.png'), size: 512, logo: 330 },
  { file: path.join(PUBLIC, 'apple-touch-icon.png'), size: 180, logo: 150 },
]

for (const job of jobs) {
  writeFileSync(job.file, await squareIcon(job.size, job.logo))
  console.log('wrote', path.relative(FRONTEND, job.file))
}
writeFileSync(path.join(PUBLIC, 'favicon.ico'), pngToIco(await squareIcon(48, 42), 48))
console.log('wrote', path.relative(FRONTEND, path.join(PUBLIC, 'favicon.ico')))
