export function fmtINR(n: number): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '₹0';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function uid(prefix = 'id'): string {
  return prefix + '_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * Real, online placeholder photo (picsum.photos) — same seed always returns
 * the same photo, so each product/index combination is stable across
 * reloads. Used as the primary image source now that the app runs in a
 * normal browser with network access (unlike the earlier sandboxed
 * preview), per request to show real images instead of generated art.
 */
export function productImageUrl(seed: string, index = 0): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}-${index}/900/1200`;
}

/**
 * Deterministic SVG placeholder (data URI) used as an offline/error
 * fallback when the online photo above fails to load (e.g. no internet).
 */
export function placeholderImage(hue: number, index = 0): string {
  const h1 = (hue + index * 14) % 360;
  const h2 = (h1 + 40) % 360;
  const id = `g${hue}_${index}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${h1},22%,93%)"/>
      <stop offset="100%" stop-color="hsl(${h2},18%,86%)"/>
    </linearGradient></defs>
    <rect width="300" height="400" fill="url(#${id})"/>
    <rect x="0.5" y="0.5" width="299" height="399" fill="none" stroke="hsl(${h1},15%,78%)" stroke-width="1"/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
