/**
 * Renders a single line of Syne as an SVG wordmark that always fills the
 * width of its container, condensing or stretching the glyphs to fit.
 *
 * This is the treatment the footer email wordmark uses, extracted so every
 * full-bleed display line on the site shares one definition. Syne ships no
 * width axis, so `lengthAdjust="spacingAndGlyphs"` is the only way to reach
 * these letterforms — it scales the glyph outlines themselves, not just the
 * tracking.
 *
 * Only for SINGLE lines that should run edge to edge. Because the fit is to
 * a fixed width, a short string stretches wide while a long one squeezes
 * narrow, so stacking several different-length lines gives each one
 * different letterforms. Multi-line headings want `.type-condensed`
 * (globals.css), which applies a fixed ratio instead.
 */
export function FitText({
  children,
  className,
  weight = 800,
  height = 112,
  fontSize = 118,
  baseline = 88,
}: {
  children: string;
  className?: string;
  weight?: 700 | 800;
  /** viewBox height. With the defaults this yields the footer's ~8.9:1 line. */
  height?: number;
  fontSize?: number;
  /** Baseline offset inside the viewBox; leaves room for descenders below. */
  baseline?: number;
}) {
  return (
    <svg
      viewBox={`0 0 1000 ${height}`}
      className={`block h-auto w-full${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={children}
    >
      <text
        x="0"
        y={baseline}
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontSize={fontSize}
        fontWeight={weight}
        fill="currentColor"
        className="font-display-showcase"
      >
        {children}
      </text>
    </svg>
  );
}
