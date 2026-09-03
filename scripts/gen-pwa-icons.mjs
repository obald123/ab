/* Regenerate the PWA / home-screen icon set from the brand mark.
 *
 *   node scripts/gen-pwa-icons.mjs
 *
 * The Frontend has no image tooling of its own, so this borrows `sharp` from
 * the sibling `backend/` package. Output overwrites Frontend/public/icons/*
 * and public/apple-touch-icon.png. (The browser-tab favicon is a separate
 * script — scripts/gen-favicon.mjs.)
 *
 * Source is the globe/swirl mark from the left of the AB Rwanda logo — the
 * full wordmark is too wide to read once cropped to an icon. Every icon is the
 * mark centred on a white ground (matching the manifest `background_color` and
 * iOS, which ignores transparency), sized well inside the 80% safe zone on the
 * maskable variant.
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

/** The globe mark lives in the left ~240px of the wide logo; trim the rest. */
async function markBuffer() {
  const slice = await sharp(SRC_LOGO)
    .extract({ left: 0, top: 0, width: 240, height: 402 })
    .png()
    .toBuffer()
  return sharp(slice).trim({ threshold: 10 }).png().toBuffer()
}

/** Square canvas, white ground, mark centred at `fraction` of the canvas. */
async function squareIcon(mark, size, fraction) {
  const inner = Math.round(size * fraction)
  const scaled = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: scaled, gravity: 'centre' }])
    .png()
    .toBuffer()
}

const mark = await markBuffer()

const jobs = [
  { file: path.join(ICONS, 'pwa-192.png'), size: 192, fraction: 0.66 },
  { file: path.join(ICONS, 'pwa-512.png'), size: 512, fraction: 0.66 },
  { file: path.join(ICONS, 'maskable-512.png'), size: 512, fraction: 0.52 },
  { file: path.join(PUBLIC, 'apple-touch-icon.png'), size: 180, fraction: 0.7 },
]

for (const job of jobs) {
  writeFileSync(job.file, await squareIcon(mark, job.size, job.fraction))
  console.log('wrote', path.relative(FRONTEND, job.file))
}
