"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Simulation } from "./Simulation";
import { createDisplayMaterial } from "./Renderer";
import { MouseController } from "./MouseController";
import { ScrollController } from "./ScrollController";
import type { RGB } from "./types";

const DYE_COLOR: RGB = [0.32, 0.31, 0.3];
const CLICK_DYE_COLOR: RGB = [0.4, 0.39, 0.38];
const SCROLL_DYE_COLOR: RGB = [0.18, 0.17, 0.17];
const MOUSE_FORCE = 3.2;
const SCROLL_FORCE = 0.35;
const CLICK_RADIUS_SCALE = 6;
const MAX_DT = 1 / 30;
const SCROLL_SPLAT_COUNT = 5;

export function FluidScene() {
  const { gl, size, viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  const simulation = useMemo(
    () => new Simulation(gl, Math.max(1, size.width), Math.max(1, size.height)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gl],
  );

  const material = useMemo(() => {
    const { width, height } = simulation.getDyeSize();
    return createDisplayMaterial(simulation.getDyeTexture(), width, height);
  }, [simulation]);

  useEffect(() => simulation.dispose, [simulation]);
  useEffect(() => material.dispose, [material]);

  useEffect(() => {
    simulation.resize(Math.max(1, size.width), Math.max(1, size.height));
    const { width, height } = simulation.getDyeSize();
    material.uniforms.texelSize.value.set(1 / width, 1 / height);
  }, [simulation, material, size.width, size.height]);

  const mouseRef = useRef<MouseController | null>(null);
  const scrollRef = useRef<ScrollController | null>(null);

  useEffect(() => {
    mouseRef.current = new MouseController();
    scrollRef.current = new ScrollController();
    return () => {
      mouseRef.current?.dispose();
      scrollRef.current?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, MAX_DT);
    const mouse = mouseRef.current;
    const scroll = scrollRef.current;

    if (mouse) {
      const { x, y, dx, dy } = mouse.sample();
      const speed = Math.hypot(dx, dy);
      if (speed > 0.0001) {
        simulation.splat(x, y, dx * MOUSE_FORCE, dy * MOUSE_FORCE, DYE_COLOR);
      }
      for (const click of mouse.consumeClicks()) {
        simulation.splat(click.x, click.y, 0, 0.35, CLICK_DYE_COLOR, CLICK_RADIUS_SCALE);
      }
    }

    if (scroll) {
      const velocity = scroll.sample(dt);
      if (Math.abs(velocity) > 0.01) {
        for (let i = 0; i < SCROLL_SPLAT_COUNT; i++) {
          const x = (i + 0.5) / SCROLL_SPLAT_COUNT;
          simulation.splat(x, 0.5, 0, velocity * SCROLL_FORCE, SCROLL_DYE_COLOR, 2.5);
        }
      }
    }

    simulation.step(dt, state.clock.elapsedTime);
    material.uniforms.uTexture.value = simulation.getDyeTexture();
  });

  return (
    <>
      <mesh ref={meshRef} material={material} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.3} luminanceThreshold={0.4} luminanceSmoothing={0.3} mipmapBlur radius={0.4} />
      </EffectComposer>
    </>
  );
}
