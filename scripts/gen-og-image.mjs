/* Regenerate the social-share preview image (Open Graph / Twitter card).
 *
 *   node scripts/gen-og-image.mjs
 *
 * Borrows `sharp` from the sibling `backend/` package (same trick as the other
 * icon scripts). Output overwrites Frontend/public/og-image.png.
 *
 * 1200x630 is the size every major scraper (Facebook, WhatsApp, LinkedIn,
 * X/Twitter, Slack, Discord, iMessage) crops to. The brand wordmark is centred
 * on white, with a thin brand-blue bar along the bottom edge.
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
const OUT = path.join(FRONTEND, 'public/og-image.png')

const W = 1200
const H = 630
const BAR = 8 // brand-blue underline, px
const LOGO_W = 720 // wordmark width on the card, px

const logo = await sharp(SRC_LOGO).resize({ width: LOGO_W, fit: 'inside' }).toBuffer()
const bar = await sharp({
  create: { width: W, height: BAR, channels: 4, background: { r: 14, g: 165, b: 233, alpha: 1 } },
})
  .png()
  .toBuffer()

const card = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([
    { input: logo, gravity: 'centre' },
    { input: bar, top: H - BAR, left: 0 },
  ])
  .png()
  .toBuffer()

writeFileSync(OUT, card)
console.log('wrote public/og-image.png', `${W}x${H}`)
