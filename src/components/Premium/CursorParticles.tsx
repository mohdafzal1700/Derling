"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMouseVelocity } from "@/hooks/useMouseVelocity";

const MAX_PARTICLES = 16;
/** Below this smoothed speed (px/s) we spawn nothing — idle cursor stays quiet. */
const SPEED_THRESHOLD = 260;
/** Minimum ms between spawns even at high speed, so it never turns into a hose. */
const MIN_SPAWN_INTERVAL_MS = 90;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  kind: "droplet" | "glint";
}

let particleSeq = 0;

/**
 * Tiny droplets/light-glints that bloom near the cursor while it's moving
 * with any real velocity, then fade — never a constant particle hose.
 * Capped at MAX_PARTICLES concurrent; each is a single motion.div driven by
 * a fixed-duration framer-motion animation, not a per-frame simulation.
 */
export function CursorParticles({ disabled = false }: { disabled?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouse = useMouseVelocity({ smoothing: 10 });
  const lastSpawn = useRef(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (disabled) return;
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      const { speed, x, y } = mouse.current;

      if (
        speed > SPEED_THRESHOLD &&
        countRef.current < MAX_PARTICLES &&
        now - lastSpawn.current > MIN_SPAWN_INTERVAL_MS
      ) {
        lastSpawn.current = now;
        const angle = Math.random() * Math.PI * 2;
        const drift = 14 + Math.random() * 22;
        const particle: Particle = {
          id: particleSeq++,
          x: x * window.innerWidth,
          y: y * window.innerHeight,
          size: 5 + Math.random() * 8,
          driftX: Math.cos(angle) * drift,
          driftY: Math.sin(angle) * drift - 10,
          duration: 0.8 + Math.random() * 0.6,
          kind: Math.random() > 0.6 ? "glint" : "droplet",
        };
        countRef.current += 1;
        setParticles((prev) => [...prev, particle]);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [disabled, mouse]);

  const remove = (id: number) => {
    countRef.current = Math.max(0, countRef.current - 1);
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  if (disabled) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 0.9, scale: 0.4 }}
            animate={{ x: p.x + p.driftX, y: p.y + p.driftY, opacity: 0, scale: 1.1 }}
            transition={{ duration: p.duration, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => remove(p.id)}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              translateX: "-50%",
              translateY: "-50%",
              background:
                p.kind === "glint"
                  ? "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,244,220,0.4) 55%, rgba(255,244,220,0) 100%)"
                  : "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(214,158,94,0.55) 45%, rgba(214,158,94,0.05) 100%)",
              boxShadow: "0 0 8px rgba(255, 230, 190, 0.35)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
