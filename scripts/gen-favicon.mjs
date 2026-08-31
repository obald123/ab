/* Regenerate the browser-tab favicon from the brand mark (the globe/swirl on
 * the left of the AB Rwanda logo — NOT the full wordmark, which is unreadable
 * at 16px).
 *
 *   node scripts/gen-favicon.mjs
 *
 * The Frontend has no image tooling of its own, so this borrows `sharp` from
 * the sibling `backend/` package (same trick as gen-pwa-icons.mjs). Output
 * overwrites Frontend/public/favicon.png and Frontend/public/favicon.ico.
 *
 * The PWA / apple-touch icons are deliberately left alone — those are
 * home-screen icons and stay as the full logo on a white ground.
 */
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(here, '..')
const require = createRequire(path.join(FRONTEND, '..', 'backend', 'package.json'))
const sharp = require('sharp')

const SRC_LOGO = path.join(FRONTEND, 'src/imports/logo1-transparent.png')
const PUBLIC = path.join(FRONTEND, 'public')

/** The globe mark lives in the left ~240px of the wide logo; trim the rest. */
async function markBuffer() {
  const slice = await sharp(SRC_LOGO)
    .extract({ left: 0, top: 0, width: 240, height: 402 })
    .png()
    .toBuffer()
  return sharp(slice).trim({ threshold: 10 }).png().toBuffer()
}

/** Square, transparent, mark centred at ~90% of the canvas. */
async function favicon(size, mark) {
  const inner = Math.round(size * 0.92)
  const scaled = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: scaled, gravity: 'centre' }])
    .png()
    .toBuffer()
}

/** Minimal ICO container wrapping one PNG (PNG-in-ICO is read by every current browser). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0)
  entry.writeUInt8(size >= 256 ? 0 : size, 1)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(22, 12)
  return Buffer.concat([header, entry, png])
}

const mark = await markBuffer()
writeFileSync(path.join(PUBLIC, 'favicon.png'), await favicon(256, mark))
console.log('wrote public/favicon.png')
writeFileSync(path.join(PUBLIC, 'favicon.ico'), pngToIco(await favicon(48, mark), 48))
console.log('wrote public/favicon.ico')
