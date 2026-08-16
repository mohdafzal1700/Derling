/** True if a hex color is light enough to need dark text/badges on top of it. */
export function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

/** Linearly blends two hex colors; t=0 -> a, t=1 -> b, clamped in between. */
export function mixHex(a: string, b: string, t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  const channels = [1, 3, 5].map((i) => {
    const from = parseInt(a.slice(i, i + 2), 16);
    const to = parseInt(b.slice(i, i + 2), 16);
    return Math.round(from + (to - from) * clamped);
  });
  return `#${channels.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
