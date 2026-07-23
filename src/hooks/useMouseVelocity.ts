"use client";

import { useEffect, useRef } from "react";

export interface MouseVelocitySample {
  /** Normalized viewport position, 0..1, origin top-left. */
  x: number;
  y: number;
  /** Pixels/second, smoothed. */
  vx: number;
  vy: number;
  /** Scalar speed, pixels/second, smoothed. */
  speed: number;
}

export interface MouseVelocityOptions {
  /** Exponential smoothing factor for velocity, higher = snappier. Default 8. */
  smoothing?: number;
}

/**
 * Tracks pointer position and a smoothed velocity estimate on `window`,
 * exposed via a ref (not state) so consumers can read it inside a rAF/
 * useFrame loop without triggering React re-renders on every pixel of
 * mouse movement.
 */
export function useMouseVelocity(options: MouseVelocityOptions = {}) {
  const { smoothing = 8 } = options;
  const sample = useRef<MouseVelocitySample>({ x: 0.5, y: 0.5, vx: 0, vy: 0, speed: 0 });
  const last = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const now = performance.now();
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (last.current) {
        const dt = Math.max(1, now - last.current.t) / 1000;
        const rawVx = ((e.clientX - last.current.x) / dt) as number;
        const rawVy = ((e.clientY - last.current.y) / dt) as number;
        const a = Math.min(1, smoothing * dt);
        sample.current.vx += (rawVx - sample.current.vx) * a;
        sample.current.vy += (rawVy - sample.current.vy) * a;
        sample.current.speed = Math.hypot(sample.current.vx, sample.current.vy);
      }

      sample.current.x = x;
      sample.current.y = y;
      last.current = { x: e.clientX, y: e.clientY, t: now };
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [smoothing]);

  return sample;
}
