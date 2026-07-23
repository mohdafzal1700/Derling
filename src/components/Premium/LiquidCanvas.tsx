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

const DISPLAY_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main () {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Thicker, heavier-feeling fluid than the ambient site-wide milk layer —
 * bigger splats that drag like cream, less vorticity so it reads as a
 * viscous bend rather than a rippling wave, and enough lingering velocity
 * that motion keeps drifting briefly after the pointer stops. */
const HERO_SIMULATION_CONFIG: Partial<SimulationConfig> = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 0.06,
  velocityDissipation: 0.22,
  pressureIterations: 20,
  curlStrength: 6,
  splatRadius: 0.025,
  ambientAmplitude: 0.02,
  ambientScale: 2.2,
};

const DYE_COLOR: RGB = [0.5, 0.4, 0.32];
const MOUSE_FORCE = 1.8;
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

  useFrame((state, delta) => {
    const mouse = mouseRef.current;
    if (mouse) {
      const { x, y, dx, dy } = mouse.sample();
      const speed = Math.hypot(dx, dy);
      if (!paused && speed > 0.0001) {
        simulation.splat(x, y, dx * MOUSE_FORCE, dy * MOUSE_FORCE, DYE_COLOR);
      }
    }

    if (!paused) {
      const dt = Math.min(delta, MAX_DT);
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
