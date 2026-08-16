"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Same as framer-motion's `useReducedMotion`, but safe to use for
 * conditional rendering under SSR. The raw hook computes its value
 * synchronously from `matchMedia` on the very first client render — which
 * can differ from the server's (window-less, always-false) render — so
 * anything conditionally rendered on it directly (e.g. `{!reduced && <X/>}`)
 * throws a hydration mismatch whenever the visitor actually has reduced
 * motion enabled. This mirrors the server's `false` through the client's
 * first render too, then applies the real value in an effect — a normal
 * post-mount state update, not a hydration diff.
 */
export function useReducedMotionSafe(): boolean {
  const raw = useReducedMotion();
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    // Intentional: this is the sanctioned fix for the exact mismatch
    // described above, not an avoidable synchronous setState — the value
    // must diverge from the server's `false` only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSafe(Boolean(raw));
  }, [raw]);

  return safe;
}
