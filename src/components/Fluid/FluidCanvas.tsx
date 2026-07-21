"use client";

import { Canvas } from "@react-three/fiber";
import { FluidScene } from "./FluidScene";

/**
 * Fixed, fullscreen, non-interactive WebGL layer. Sits behind all UI and
 * above the body background; the UI keeps normal document flow/scrolling on
 * top of it. Pointer/scroll input is read globally by the fluid controllers,
 * not through this canvas, so `pointer-events: none` keeps the UI clickable.
 */
export function FluidCanvas() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        orthographic={false}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        camera={{ position: [0, 0, 1], fov: 50 }}
      >
        <FluidScene />
      </Canvas>
    </div>
  );
}
