"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Simulation } from "@/components/Fluid/Simulation";
import { MouseController } from "@/components/Fluid/MouseController";
import type { RGB, SimulationConfig } from "@/components/Fluid/types";
import heroDisplayFrag from "./Shaders/heroDisplay.glsl";
import { containTransform, coverTransform, HERO_SHADER_DEFAULTS } from "@/lib/shader";
import { dampFactor } from "@/lib/animation";

const DISPLAY_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main () {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Thick, heavy, "premium caramel" tuning — idle stays almost frozen, and an
 * active disturbance genuinely *flows* (advects, shears, trails) rather than
 * behaving like a circular lens glued to the cursor:
 *
 * - splatRadius ≈0.006: splat.glsl's falloff is `exp(-dot(p,p)/radius)`, i.e.
 *   it divides by radius, not radius² — the visually-intuitive "1/e width"
 *   is `sqrt(radius)`, not radius itself. 0.006 → ~7.7% of screen width
 *   (matches the site-wide ambient layer's own default). An earlier 0.03
 *   here looked like "small" but was actually ~17% of screen width per
 *   splat, and combined with low dissipation saturated into a screen-
 *   spanning white plateau — a much *worse* "circle" than the one this
 *   whole pass is meant to eliminate. Keep this small; use the path-walk
 *   below (not a bigger radius) to make fast motion read as a streak.
 * - curlStrength ≈1.5: enough vorticity confinement that an injected splat
 *   folds/shears as it's transported instead of staying a symmetric Gaussian
 *   bump. Still far below the ambient milk layer's 20 (that's meant to look
 *   turbulent; this should read as thick, not choppy).
 * - velocityDissipation ≈0.7 / densityDissipation ≈0.55: the advection
 *   dissipation divide (see advection.glsl: `result / (1 + dissipation*dt)`)
 *   approximates exponential decay `v(t) ≈ v0 * exp(-dissipation*t)`
 *   regardless of frame rate — these settle to ~5% residual by t≈4-5s,
 *   giving curl+advection enough time to visibly deform the disturbance
 *   into streaks/folds before it fades ("several seconds", not instant).
 * - ambientAmplitude / dyeShimmerAmplitude near-zero: idle motion is only
 *   ever the ~0.2-0.5% "microscopic shimmer" the brief asks for, not a
 *   continuously-animating wave.
 *
 * The other half of "flows, doesn't teleport a blob" is in useFrame below:
 * a fast pointer move is injected as several splats walked along the path
 * since the last frame, not one splat at the destination.
 */
const HERO_SIMULATION_CONFIG: Partial<SimulationConfig> = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 0.55,
  velocityDissipation: 0.7,
  pressureIterations: 30,
  curlStrength: 1,
  splatRadius: 0.006,
  ambientAmplitude: 0.0015,
  ambientScale: 2.2,
  dyeShimmerAmplitude: 0.003,
  dyeShimmerScale: 4,
  dyeRelaxRate: 0.05,
  dyeBaseline: 0.4,
  // Gentle: alpha stays large relative to beta (mostly restoring pull, only
  // a modest neighbor-average blend) so this nudges cohesion without
  // smoothing the injected motion into nothing — see diffuse.glsl.
  viscosity: 0.0025,
  diffusionIterations: 4,
};

const DYE_COLOR: RGB = [0.5, 0.4, 0.32];
const MOUSE_FORCE = 2.2;
/** Below this smoothed-cursor speed (UV units/frame) we treat the pointer as
 * stopped and inject nothing — the sim's own dissipation handles settling. */
const MOVE_EPSILON = 0.00005;
/** Speed (UV units/frame) at which the splat reaches maximum elongation —
 * below this it blends toward a plain circle (a barely-moving pointer has
 * no meaningful direction to stretch along), above it the injection is a
 * fully-formed comet. */
const ELONGATION_SPEED_SCALE = 0.01;
/** Cap on how pronounced the comet's leading/trailing asymmetry gets — see
 * splat.glsl. 1 = circle. */
const MAX_ELONGATION = 3.5;
/** Target spacing (UV units) between sub-splats walked along the cursor's
 * path this frame. Comparable to sqrt(splatRadius) so consecutive splats overlap
 * into a continuous ribbon instead of leaving gaps (which would read as a
 * dotted line at high speed) or wastefully over-stacking (a single point
 * barely moving shouldn't cost more than one splat — see MAX_SPLAT_STEPS). */
const SPLAT_STEP_UV = 0.03;
const MAX_SPLAT_STEPS = 8;
/** How quickly the smoothed cursor catches up to the raw pointer — tuned to
 * match `lerp(current, target, 0.08)` at 60fps but frame-rate independent
 * (see dampFactor), so fast flicks still register fully once the target
 * stops changing, only the transient start/stop is softened. */
const CURSOR_SMOOTHING_RATE = 5;
const MAX_DT = 1 / 30;
/** Extra scale on the mesh so the subtle product-float pan/rotate never
 * reveals an edge of the quad. */
const FLOAT_OVERSCAN = 1.05;

interface LiquidPlaneProps {
  imageSrc: string;
  paused: boolean;
}

function LiquidPlane({ imageSrc, paused }: LiquidPlaneProps) {
  const { gl, size, viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageSrc);
  // Sharpens the crisp foreground when the liquid displacement samples it at
  // a slight angle/offset — cheap, and the default anisotropy is 1 (off).
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();

  const simulation = useMemo(
    () => new Simulation(gl, Math.max(1, size.width), Math.max(1, size.height), HERO_SIMULATION_CONFIG),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gl],
  );

  const material = useMemo(() => {
    const { width, height } = simulation.getDyeSize();
    return new THREE.ShaderMaterial({
      vertexShader: DISPLAY_VERTEX_SHADER,
      fragmentShader: heroDisplayFrag,
      uniforms: {
        uPhoto: { value: texture },
        uDye: { value: simulation.getDyeTexture() },
        texelSize: { value: new THREE.Vector2(1 / width, 1 / height) },
        uFitScale: { value: new THREE.Vector2(1, 1) },
        uFitOffset: { value: new THREE.Vector2(0, 0) },
        uBgScale: { value: new THREE.Vector2(1, 1) },
        uBgOffset: { value: new THREE.Vector2(0, 0) },
        uDisplacement: { value: HERO_SHADER_DEFAULTS.displacement },
        uEdgeFeather: { value: HERO_SHADER_DEFAULTS.edgeFeather },
        uBackdropBlurRadius: { value: HERO_SHADER_DEFAULTS.backdropBlurRadius },
        uBackdropDarken: { value: HERO_SHADER_DEFAULTS.backdropDarken },
        uNormalGain: { value: HERO_SHADER_DEFAULTS.normalGain },
        uNormalSampleScale: { value: HERO_SHADER_DEFAULTS.normalSampleScale },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulation, texture]);

  useEffect(() => () => simulation.dispose(), [simulation]);
  useEffect(() => () => material.dispose(), [material]);

  // Recompute the contain (crisp photo) + cover (blurred backdrop) UV
  // transforms whenever the viewport or the (now-loaded) image's natural
  // aspect ratio changes. The photo is never cropped — only the backdrop is.
  useEffect(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const imageAspect = img?.width && img?.height ? img.width / img.height : 16 / 9;
    const containerAspect = size.width / size.height;

    const fit = containTransform(containerAspect, imageAspect);
    material.uniforms.uFitScale.value.copy(fit.scale);
    material.uniforms.uFitOffset.value.copy(fit.offset);

    const bg = coverTransform(containerAspect, imageAspect);
    material.uniforms.uBgScale.value.copy(bg.scale);
    material.uniforms.uBgOffset.value.copy(bg.offset);
  }, [material, size.width, size.height, texture]);

  useEffect(() => {
    simulation.resize(Math.max(1, size.width), Math.max(1, size.height));
    const { width, height } = simulation.getDyeSize();
    material.uniforms.texelSize.value.set(1 / width, 1 / height);
  }, [simulation, material, size.width, size.height]);

  const mouseRef = useRef<MouseController | null>(null);
  useEffect(() => {
    mouseRef.current = new MouseController();
    return () => mouseRef.current?.dispose();
  }, []);

  // Smoothed cursor position, never the raw per-frame pointer sample — this
  // is what turns jittery HID input into the "buttery", weighted motion the
  // brief asks for. Force is derived from how fast *this* moves, so a
  // stationary raw pointer converges to zero delta within a few frames
  // (no residual force), while a moving pointer tracks it with a slight,
  // physically-motivated lag instead of 1:1.
  const smoothedPos = useRef<{ x: number; y: number } | null>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, MAX_DT);
    const mouse = mouseRef.current;
    if (mouse) {
      const { x, y } = mouse.sample();
      if (!smoothedPos.current) smoothedPos.current = { x, y };
      const prevX = smoothedPos.current.x;
      const prevY = smoothedPos.current.y;
      const k = dampFactor(CURSOR_SMOOTHING_RATE, dt);
      smoothedPos.current.x += (x - prevX) * k;
      smoothedPos.current.y += (y - prevY) * k;

      const dx = smoothedPos.current.x - prevX;
      const dy = smoothedPos.current.y - prevY;
      const speed = Math.hypot(dx, dy);
      if (!paused && speed > MOVE_EPSILON) {
        // Walk the path since last frame instead of splatting once at the
        // destination — a fast swipe leaves a continuous injected streak,
        // not a series of separate circular dots the eye reads as "a blob
        // jumping between positions". Force is split across the steps so
        // the total momentum injected this frame stays the same either way.
        const steps = Math.min(MAX_SPLAT_STEPS, Math.max(1, Math.ceil(speed / SPLAT_STEP_UV)));
        const forceX = (dx / steps) * MOUSE_FORCE;
        const forceY = (dy / steps) * MOUSE_FORCE;
        // The splat itself is shaped along the motion — compressed ahead,
        // trailing behind (see splat.glsl) — not just a circle later
        // smeared by advection. Barely-moving input blends toward a plain
        // circle rather than snapping to a jittery, near-random direction.
        const direction: [number, number] = [dx / speed, dy / speed];
        const elongation = 1 + Math.min(1, speed / ELONGATION_SPEED_SCALE) * (MAX_ELONGATION - 1);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          simulation.splat(prevX + dx * t, prevY + dy * t, forceX, forceY, DYE_COLOR, 1, direction, elongation);
        }
      }
    }

    if (!paused) {
      simulation.step(dt, state.clock.elapsedTime);
    }
    material.uniforms.uDye.value = simulation.getDyeTexture();

    // Imperceptible product float: slow, tiny pan + rotation, two out-of-
    // phase sine waves so it never reads as a loop.
    if (meshRef.current && !paused) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(t * 0.08) * 0.006;
      meshRef.current.position.x = Math.sin(t * 0.065) * viewport.width * 0.004;
      meshRef.current.position.y = Math.cos(t * 0.05) * viewport.height * 0.003;
    }
  });

  return (
    <mesh ref={meshRef} material={material} scale={[viewport.width * FLOAT_OVERSCAN, viewport.height * FLOAT_OVERSCAN, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export interface LiquidCanvasProps {
  imageSrc: string;
  /** Freezes the simulation (e.g. prefers-reduced-motion, tab hidden, low-end device). */
  paused?: boolean;
  className?: string;
}

/**
 * Fullscreen, non-interactive WebGL hero background: the real product photo
 * shown uncropped (object-fit: contain — never zoomed), displaced by a GPU
 * fluid sim so it bends/flows like a glossy cream glaze under the cursor. A
 * heavily blurred, cover-fit copy of the same photo fills the space around
 * it so the viewport is never letterboxed, without ever tinting or
 * re-lighting the product photo's own colors. Pointer input is read
 * globally (see MouseController), so this stays pointer-events:none and
 * everything above it (nav, copy) stays fully interactive.
 */
export function LiquidCanvas({ imageSrc, paused = false, className }: LiquidCanvasProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <Canvas
        flat
        dpr={[1, 2]}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 1], fov: 50 }}
      >
        <Suspense fallback={null}>
          <LiquidPlane imageSrc={imageSrc} paused={paused} />
        </Suspense>
      </Canvas>
    </div>
  );
}
