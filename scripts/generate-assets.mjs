/**
 * Generate brand assets with sharp:
 *  - 6 course cover images (SVG-composed, brand-consistent, text-free)
 *  - OG image (1200x630) for social sharing
 *  - App icon (SVG + PNG 192/512)
 *  - Copies the AI-generated teacher portrait into public/images/
 *
 * Usage: node scripts/generate-assets.mjs [path-to-portrait]
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const IMAGES = path.join(PUBLIC, "images");

const C_DEEP = "#0e5a4b";
const C_DARK = "#0a453a";
const GOLD = "#c2923b";
const GOLD_LIGHT = "#d9b45c";
const CREAM = "#faf9f5";

function coverSvg(symbols, variant) {
  const grid = `
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>
    </pattern>`;
  const rings = `
    <circle cx="1010" cy="120" r="210" fill="none" stroke="rgba(201,146,59,0.28)" stroke-width="2"/>
    <circle cx="1010" cy="120" r="160" fill="none" stroke="rgba(201,146,59,0.16)" stroke-width="1.5"/>
    <circle cx="120" cy="640" r="150" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"/>`;
  const monogram = `
    <rect x="48" y="640" width="52" height="52" rx="12" fill="${GOLD}"/>
    <text x="74" y="678" font-family="DejaVu Sans, sans-serif" font-size="30" font-weight="bold" fill="#2a1f06" text-anchor="middle">K</text>`;

  const symbolSvg = symbols
    .map(
      (s, i) => `
    <text x="${s.x}" y="${s.y}" font-family="DejaVu Sans, Georgia, serif" font-size="${s.size}" font-weight="bold" fill="${s.color ?? "rgba(250,249,245,0.92)"}" opacity="${s.opacity ?? 1}" text-anchor="middle">${s.ch}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${variant === "dark" ? C_DARK : C_DEEP}"/>
        <stop offset="1" stop-color="${C_DARK}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.8" cy="0.15" r="0.9">
        <stop offset="0" stop-color="rgba(201,146,59,0.16)"/>
        <stop offset="1" stop-color="rgba(201,146,59,0)"/>
      </radialGradient>
      ${grid}
    </defs>
    <rect width="1200" height="750" fill="url(#bg)"/>
    <rect width="1200" height="750" fill="url(#glow)"/>
    <rect width="1200" height="750" fill="url(#grid)"/>
    ${rings}
    ${symbolSvg}
    ${monogram}
  </svg>`;
}

const covers = [
  { file: "cover-algebra.png", symbols: [
    { ch: "x²", x: 640, y: 300, size: 190, color: GOLD_LIGHT, opacity: 0.95 },
    { ch: "∑", x: 880, y: 500, size: 110, opacity: 0.5 },
    { ch: "√", x: 420, y: 520, size: 90, opacity: 0.45 },
  ]},
  { file: "cover-geometry.png", symbols: [
    { ch: "△", x: 600, y: 330, size: 190, color: GOLD_LIGHT, opacity: 0.95 },
    { ch: "◯", x: 860, y: 480, size: 110, opacity: 0.5 },
    { ch: "∠", x: 400, y: 520, size: 90, opacity: 0.45 },
  ]},
  { file: "cover-functions.png", symbols: [
    { ch: "ƒ(x)", x: 640, y: 300, size: 140, color: GOLD_LIGHT, opacity: 0.95 },
    { ch: "∞", x: 880, y: 500, size: 110, opacity: 0.5 },
    { ch: "→", x: 420, y: 520, size: 100, opacity: 0.45 },
  ]},
  { file: "cover-calculus.png", symbols: [
    { ch: "∫", x: 620, y: 310, size: 190, color: GOLD_LIGHT, opacity: 0.95 },
    { ch: "dy", x: 880, y: 480, size: 100, opacity: 0.5 },
    { ch: "lim", x: 400, y: 520, size: 90, opacity: 0.45 },
  ]},
  { file: "cover-probability.png", symbols: [
    { ch: "P(A)", x: 620, y: 300, size: 140, color: GOLD_LIGHT, opacity: 0.95 },
    { ch: "n!", x: 870, y: 490, size: 100, opacity: 0.5 },
    { ch: "≠", x: 420, y: 520, size: 90, opacity: 0.45 },
  ]},
  { file: "cover-review.png", symbols: [
    { ch: "✓", x: 620, y: 300, size: 190, color: GOLD_LIGHT, opacity: 0.95 },
    { ch: "★", x: 870, y: 490, size: 100, opacity: 0.5 },
    { ch: "✎", x: 420, y: 520, size: 90, opacity: 0.45 },
  ]},
];

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C_DEEP}"/>
      <stop offset="1" stop-color="${C_DARK}"/>
    </linearGradient>
    <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="150" cy="120" r="230" fill="none" stroke="rgba(201,146,59,0.30)" stroke-width="2"/>
  <circle cx="150" cy="120" r="180" fill="none" stroke="rgba(201,146,59,0.14)" stroke-width="1.5"/>
  <circle cx="1060" cy="540" r="260" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"/>
  <circle cx="1060" cy="540" r="200" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="80" y="80" width="96" height="96" rx="22" fill="${GOLD}"/>
  <text x="128" y="152" font-family="DejaVu Sans, sans-serif" font-size="56" font-weight="bold" fill="#2a1f06" text-anchor="middle">K</text>
  <text x="212" y="140" font-family="DejaVu Sans, sans-serif" font-size="34" font-weight="bold" fill="${CREAM}">Mathematics · Cairo</text>
  <text x="212" y="182" font-family="DejaVu Sans, sans-serif" font-size="22" fill="rgba(250,249,245,0.72)">Understand the subject. Don't just memorize it.</text>
</svg>`;

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C_DEEP}"/>
      <stop offset="1" stop-color="${C_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="404" cy="112" r="92" fill="none" stroke="rgba(201,146,59,0.35)" stroke-width="6"/>
  <text x="256" y="330" font-family="DejaVu Sans, sans-serif" font-size="240" font-weight="bold" fill="${GOLD_LIGHT}" text-anchor="middle">K</text>
</svg>`;

async function main() {
  await fs.mkdir(IMAGES, { recursive: true });
  const portraitArg = process.argv[2];

  if (portraitArg) {
    const src = path.resolve(process.cwd(), portraitArg);
    await sharp(src).resize({ width: 1000 }).toFile(path.join(IMAGES, "teacher-portrait.png"));
    console.log("OK teacher-portrait.png (from", portraitArg + ")");
  } else {
    console.log("SKIP teacher-portrait.png (no source passed)");
  }

  for (const c of covers) {
    await sharp(Buffer.from(coverSvg(c.symbols, c.variant))).png().toFile(path.join(IMAGES, c.file));
    console.log("OK", c.file);
  }

  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(IMAGES, "og.png"));
  console.log("OK og.png");

  await fs.mkdir(PUBLIC, { recursive: true });
  await fs.writeFile(path.join(PUBLIC, "app-icon.svg"), iconSvg);
  for (const size of [192, 512]) {
    await sharp(Buffer.from(iconSvg)).resize(size, size).png().toFile(path.join(PUBLIC, `icon-${size}.png`));
    console.log(`OK icon-${size}.png`);
  }
  console.log("Assets done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
