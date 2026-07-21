import * as THREE from "three";
import displayFrag from "./Shaders/display.glsl";

const DISPLAY_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main () {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export interface DisplayColors {
  base: THREE.Vector3;
  highlight: THREE.Vector3;
}

export const DEFAULT_DISPLAY_COLORS: DisplayColors = {
  // Thick milk / soft cream palette — kept wide apart so the shimmer/flow
  // is actually visible; two near-white tones read as flat, motionless white.
  base: new THREE.Vector3(0.64, 0.62, 0.6),
  highlight: new THREE.Vector3(1.0, 0.99, 0.97),
};

/**
 * Builds the final fullscreen display material that turns the dye density
 * field into a soft, lit, milk-like liquid. Consumed by a plane mesh inside
 * FluidScene; bloom/soft glow on top of this is applied via postprocessing.
 */
export function createDisplayMaterial(dyeTexture: THREE.Texture, dyeWidth: number, dyeHeight: number) {
  return new THREE.ShaderMaterial({
    vertexShader: DISPLAY_VERTEX_SHADER,
    fragmentShader: displayFrag,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTexture: { value: dyeTexture },
      texelSize: { value: new THREE.Vector2(1 / dyeWidth, 1 / dyeHeight) },
      baseColor: { value: DEFAULT_DISPLAY_COLORS.base.clone() },
      highlightColor: { value: DEFAULT_DISPLAY_COLORS.highlight.clone() },
    },
  });
}
