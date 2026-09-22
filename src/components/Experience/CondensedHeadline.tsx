"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The measurement has to land before paint or the headline visibly resizes,
 * which is `useLayoutEffect` — but this component is server-rendered first,
 * and React warns that it does nothing there. On the server the plain effect
 * is equivalent (neither runs) and silent.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A multi-line display headline condensed to the width of its container.
 *
 * This is the RAGGED counterpart to `FitText`. FitText stretches each line
 * individually to the full container width, so a short line gets fat glyphs
 * and every line ends flush — wrong whenever the design wants a short closing
 * line (see BoldRevealSection, where "before." is meant to trail off).
 *
 * Here the horizontal squeeze is measured ONCE from the widest line and then
 * applied to all of them, so the letterforms stay identical line to line and
 * the shorter lines simply end early.
 *
 * It measures rather than assuming a ratio because Syne's glyphs are far wider
 * than a condensed grotesque's: any hardcoded `scaleX` or `vw` font size is a
 * guess at the font metrics, and being wrong overflows the viewport or leaves
 * the frame half empty. `scaleX` is also the only lever available — Syne ships
 * no width axis, so `font-stretch` does nothing to it.
 */
export function CondensedHeadline({
  lines,
  /**
   * Font size as a fraction of the container's WIDTH — the one knob for how
   * heavy the block reads. Raising it makes the glyphs taller, which forces a
   * harder squeeze to keep the longest line on one line, giving the tall
   * narrow letterforms of a true condensed face. Too far and the vertical
   * stems thin out against the horizontals and the face starts to look broken.
   */
  sizeRatio = 0.105,
  className,
}: {
  lines: string[];
  sizeRatio?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ fontSize: number; scaleX: number } | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const probe = probeRef.current;
    if (!container || !probe) return;

    const width = container.clientWidth;
    if (!width) return;

    const fontSize = width * sizeRatio;
    probe.style.fontSize = `${fontSize}px`;
    // Widest line at its natural, unsqueezed width. The probe is `nowrap`, so
    // this is the true single-line advance, not a wrapped box.
    const natural = Math.max(
      ...Array.from(probe.children, (child) => child.getBoundingClientRect().width),
    );

    setFit({ fontSize, scaleX: natural > 0 ? Math.min(1, width / natural) : 1 });
  }, [sizeRatio]);

  useIsomorphicLayoutEffect(measure, [measure, lines]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // Glyph advances change the moment the webfont swaps in, so an initial
    // measurement taken against the fallback face would be wrong.
    void document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className={className}>
      {/* Measured off-flow at the real font, never painted. `invisible` rather
          than `hidden` — a display:none box has no width to measure. */}
      <div
        ref={probeRef}
        aria-hidden
        className="font-display-showcase pointer-events-none invisible absolute whitespace-nowrap uppercase"
        style={{ fontWeight: 800 }}
      >
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {fit ? (
        <div
          className="font-display-showcase uppercase leading-[0.85] tracking-[-0.01em]"
          style={{
            fontWeight: 800,
            fontSize: `${fit.fontSize}px`,
            transform: `scaleX(${fit.scaleX})`,
            transformOrigin: "left center",
            // Pre-transform width, so the squeezed box lands back on exactly
            // 100% of the container instead of leaving a dead right gutter.
            width: `${100 / fit.scaleX}%`,
          }}
        >
          {lines.map((line) => (
            <div key={line} className="whitespace-nowrap">
              {line}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
