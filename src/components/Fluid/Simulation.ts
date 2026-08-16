import * as THREE from "three";
import baseVert from "./Shaders/base.vert.glsl";
import advectionFrag from "./Shaders/advection.glsl";
import divergenceFrag from "./Shaders/divergence.glsl";
import curlFrag from "./Shaders/curl.glsl";
import vorticityFrag from "./Shaders/vorticity.glsl";
import pressureFrag from "./Shaders/pressure.glsl";
import gradientFrag from "./Shaders/gradient.glsl";
import clearFrag from "./Shaders/clear.glsl";
import splatFrag from "./Shaders/splat.glsl";
import diffuseFrag from "./Shaders/diffuse.glsl";
import ambientFrag from "./Shaders/ambient.glsl";
import fillFrag from "./Shaders/fill.glsl";
import dyeNoiseFrag from "./Shaders/dyeNoise.glsl";
import type { RGB, SimulationConfig } from "./types";

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 0,
  velocityDissipation: 0.3,
  pressureIterations: 20,
  curlStrength: 20,
  splatRadius: 0.006,
  ambientAmplitude: 0.05,
  ambientScale: 3.0,
  viscosity: 0,
  diffusionIterations: 0,
  // Full-screen baseline density so the liquid always covers the entire
  // viewport instead of appearing as isolated blobs over an empty field.
  dyeBaseline: 0.4,
  // Fraction of the way back toward dyeBaseline the field relaxes each
  // frame — settles interaction bumps without ever draining to black.
  dyeRelaxRate: 0.035,
  // Amplitude/scale of the perpetual low-frequency shimmer layered on top of
  // the baseline so the surface always has visible motion, even at rest.
  dyeShimmerAmplitude: 0.07,
  dyeShimmerScale: 5.5,
};

const FBO_OPTIONS: THREE.RenderTargetOptions = {
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  type: THREE.HalfFloatType,
  format: THREE.RGBAFormat,
  depthBuffer: false,
  stencilBuffer: false,
};

class DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;

  constructor(width: number, height: number) {
    this.read = new THREE.WebGLRenderTarget(width, height, FBO_OPTIONS);
    this.write = new THREE.WebGLRenderTarget(width, height, FBO_OPTIONS);
  }

  swap() {
    const tmp = this.read;
    this.read = this.write;
    this.write = tmp;
  }

  setSize(width: number, height: number) {
    this.read.setSize(width, height);
    this.write.setSize(width, height);
  }

  dispose() {
    this.read.dispose();
    this.write.dispose();
  }
}

function makeMaterial(fragmentShader: string, uniforms: Record<string, THREE.IUniform>) {
  return new THREE.RawShaderMaterial({
    vertexShader: baseVert,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
}

/**
 * GPU Navier-Stokes fluid solver (Jos Stam "Stable Fluids" scheme, the
 * standard real-time approach for this problem). Every pass is a fullscreen
 * shader executed into a float render target; the CPU only supplies
 * time deltas and splat requests.
 */
export class Simulation {
  private renderer: THREE.WebGLRenderer;
  private config: SimulationConfig;

  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quad: THREE.Mesh;

  private simWidth = 1;
  private simHeight = 1;
  private dyeWidth = 1;
  private dyeHeight = 1;
  private aspectRatio = 1;

  private velocity: DoubleFBO;
  private dye: DoubleFBO;
  private pressure: DoubleFBO;
  private divergenceTarget: THREE.WebGLRenderTarget;
  private curlTarget: THREE.WebGLRenderTarget;
  /** Fixed diffusion RHS (b) for the duration of the Jacobi loop each step —
   * same role as divergenceTarget plays for the pressure solve. */
  private diffusionSource: THREE.WebGLRenderTarget;

  private materials: {
    advection: THREE.RawShaderMaterial;
    divergence: THREE.RawShaderMaterial;
    curl: THREE.RawShaderMaterial;
    vorticity: THREE.RawShaderMaterial;
    diffuse: THREE.RawShaderMaterial;
    pressure: THREE.RawShaderMaterial;
    gradient: THREE.RawShaderMaterial;
    clear: THREE.RawShaderMaterial;
    splat: THREE.RawShaderMaterial;
    ambient: THREE.RawShaderMaterial;
    fill: THREE.RawShaderMaterial;
    dyeNoise: THREE.RawShaderMaterial;
  };

  private elapsed = 0;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number, config: Partial<SimulationConfig> = {}) {
    this.renderer = renderer;
    this.config = { ...DEFAULT_SIMULATION_CONFIG, ...config };

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), 2),
    );
    this.quad = new THREE.Mesh(geometry);
    this.quad.frustumCulled = false;
    // 2-component position attribute makes computeBoundingSphere() produce
    // NaN (it assumes 3 components); frustumCulled=false means it's never
    // consulted, so skip it rather than let it warn on every render.
    this.quad.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1);
    this.scene.add(this.quad);

    const { simW, simH, dyeW, dyeH } = this.computeResolutions(width, height);
    this.simWidth = simW;
    this.simHeight = simH;
    this.dyeWidth = dyeW;
    this.dyeHeight = dyeH;
    this.aspectRatio = width / height;

    this.velocity = new DoubleFBO(this.simWidth, this.simHeight);
    this.dye = new DoubleFBO(this.dyeWidth, this.dyeHeight);
    this.pressure = new DoubleFBO(this.simWidth, this.simHeight);
    this.divergenceTarget = new THREE.WebGLRenderTarget(this.simWidth, this.simHeight, FBO_OPTIONS);
    this.curlTarget = new THREE.WebGLRenderTarget(this.simWidth, this.simHeight, FBO_OPTIONS);
    this.diffusionSource = new THREE.WebGLRenderTarget(this.simWidth, this.simHeight, FBO_OPTIONS);

    this.materials = {
      advection: makeMaterial(advectionFrag, {
        texelSize: { value: new THREE.Vector2() },
        dyeTexelSize: { value: new THREE.Vector2() },
        uVelocity: { value: null },
        uSource: { value: null },
        dt: { value: 0 },
        dissipation: { value: 0 },
      }),
      divergence: makeMaterial(divergenceFrag, {
        texelSize: { value: new THREE.Vector2() },
        uVelocity: { value: null },
      }),
      curl: makeMaterial(curlFrag, {
        texelSize: { value: new THREE.Vector2() },
        uVelocity: { value: null },
      }),
      vorticity: makeMaterial(vorticityFrag, {
        texelSize: { value: new THREE.Vector2() },
        uVelocity: { value: null },
        uCurl: { value: null },
        curlStrength: { value: this.config.curlStrength },
        dt: { value: 0 },
      }),
      diffuse: makeMaterial(diffuseFrag, {
        texelSize: { value: new THREE.Vector2() },
        uVelocity: { value: null },
        uSource: { value: null },
        alpha: { value: 0 },
        beta: { value: 1 },
      }),
      pressure: makeMaterial(pressureFrag, {
        texelSize: { value: new THREE.Vector2() },
        uPressure: { value: null },
        uDivergence: { value: null },
      }),
      gradient: makeMaterial(gradientFrag, {
        texelSize: { value: new THREE.Vector2() },
        uPressure: { value: null },
        uVelocity: { value: null },
      }),
      clear: makeMaterial(clearFrag, {
        uTexture: { value: null },
        value: { value: 0.8 },
      }),
      splat: makeMaterial(splatFrag, {
        uTarget: { value: null },
        aspectRatio: { value: this.aspectRatio },
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
        radius: { value: this.config.splatRadius },
        dir: { value: new THREE.Vector2(0, 0) },
        elongation: { value: 1 },
      }),
      ambient: makeMaterial(ambientFrag, {
        uVelocity: { value: null },
        time: { value: 0 },
        dt: { value: 0 },
        amplitude: { value: this.config.ambientAmplitude },
        scale: { value: this.config.ambientScale },
      }),
      fill: makeMaterial(fillFrag, {
        value: { value: this.config.dyeBaseline },
      }),
      dyeNoise: makeMaterial(dyeNoiseFrag, {
        uSource: { value: null },
        time: { value: 0 },
        amplitude: { value: this.config.dyeShimmerAmplitude },
        scale: { value: this.config.dyeShimmerScale },
        baseline: { value: this.config.dyeBaseline },
        relaxRate: { value: this.config.dyeRelaxRate },
      }),
    };

    this.setTexelUniforms();
    this.seedDye();
  }

  /** Fills the entire dye field with a baseline density, then pre-warms the
   * shimmer pass so the liquid covers the whole viewport with visible
   * texture from the very first frame instead of building up gradually. */
  private seedDye() {
    const fill = this.materials.fill;
    this.renderPass(fill, this.dye.read);
    this.renderPass(fill, this.dye.write);

    const dyeNoise = this.materials.dyeNoise;
    for (let i = 0; i < 60; i++) {
      dyeNoise.uniforms.uSource.value = this.dye.read.texture;
      dyeNoise.uniforms.time.value = i * 0.4;
      this.renderPass(dyeNoise, this.dye.write);
      this.dye.swap();
    }
    this.renderer.setRenderTarget(null);
  }

  private computeResolutions(width: number, height: number) {
    const aspect = width / height;
    const simMax = this.config.simResolution;
    const dyeMax = this.config.dyeResolution;

    const simW = aspect >= 1 ? simMax : Math.round(simMax * aspect);
    const simH = aspect >= 1 ? Math.round(simMax / aspect) : simMax;
    const dyeW = aspect >= 1 ? dyeMax : Math.round(dyeMax * aspect);
    const dyeH = aspect >= 1 ? Math.round(dyeMax / aspect) : dyeMax;

    return {
      simW: Math.max(1, simW),
      simH: Math.max(1, simH),
      dyeW: Math.max(1, dyeW),
      dyeH: Math.max(1, dyeH),
    };
  }

  private setTexelUniforms() {
    const simTexel = new THREE.Vector2(1 / this.simWidth, 1 / this.simHeight);
    const dyeTexel = new THREE.Vector2(1 / this.dyeWidth, 1 / this.dyeHeight);

    this.materials.advection.uniforms.texelSize.value.copy(simTexel);
    this.materials.advection.uniforms.dyeTexelSize.value.copy(simTexel);
    this.materials.divergence.uniforms.texelSize.value.copy(simTexel);
    this.materials.curl.uniforms.texelSize.value.copy(simTexel);
    this.materials.vorticity.uniforms.texelSize.value.copy(simTexel);
    this.materials.pressure.uniforms.texelSize.value.copy(simTexel);
    this.materials.gradient.uniforms.texelSize.value.copy(simTexel);
    this.materials.diffuse.uniforms.texelSize.value.copy(simTexel);
    this.materials.splat.uniforms.aspectRatio.value = this.aspectRatio;
    void dyeTexel;
  }

  resize(width: number, height: number) {
    this.aspectRatio = width / height;
    const { simW, simH, dyeW, dyeH } = this.computeResolutions(width, height);
    this.simWidth = simW;
    this.simHeight = simH;
    this.dyeWidth = dyeW;
    this.dyeHeight = dyeH;

    this.velocity.setSize(simW, simH);
    this.pressure.setSize(simW, simH);
    this.divergenceTarget.setSize(simW, simH);
    this.curlTarget.setSize(simW, simH);
    this.diffusionSource.setSize(simW, simH);
    this.dye.setSize(dyeW, dyeH);

    this.setTexelUniforms();
  }

  private renderPass(material: THREE.RawShaderMaterial, target: THREE.WebGLRenderTarget | null) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private advectPass(source: DoubleFBO, dissipation: number, dt: number, dyeTexel: THREE.Vector2) {
    const m = this.materials.advection;
    m.uniforms.uVelocity.value = this.velocity.read.texture;
    m.uniforms.uSource.value = source.read.texture;
    m.uniforms.dt.value = dt;
    m.uniforms.dissipation.value = dissipation;
    m.uniforms.dyeTexelSize.value.copy(dyeTexel);
    this.renderPass(m, source.write);
    source.swap();
  }

  /** Advances the fluid state by one timestep. dt is clamped by the caller. */
  step(dt: number, time: number) {
    this.elapsed = time;
    const simTexel = new THREE.Vector2(1 / this.simWidth, 1 / this.simHeight);
    const dyeTexel = new THREE.Vector2(1 / this.dyeWidth, 1 / this.dyeHeight);

    // Ambient idle-motion force (always-on, GPU-only curl noise).
    const ambient = this.materials.ambient;
    ambient.uniforms.uVelocity.value = this.velocity.read.texture;
    ambient.uniforms.time.value = time;
    ambient.uniforms.dt.value = dt;
    this.renderPass(ambient, this.velocity.write);
    this.velocity.swap();

    // Curl.
    const curl = this.materials.curl;
    curl.uniforms.uVelocity.value = this.velocity.read.texture;
    this.renderPass(curl, this.curlTarget);

    // Vorticity confinement.
    const vorticity = this.materials.vorticity;
    vorticity.uniforms.uVelocity.value = this.velocity.read.texture;
    vorticity.uniforms.uCurl.value = this.curlTarget.texture;
    vorticity.uniforms.dt.value = dt;
    this.renderPass(vorticity, this.velocity.write);
    this.velocity.swap();

    // Divergence.
    const divergence = this.materials.divergence;
    divergence.uniforms.uVelocity.value = this.velocity.read.texture;
    this.renderPass(divergence, this.divergenceTarget);

    // Pressure decay + Jacobi solve.
    const clear = this.materials.clear;
    clear.uniforms.uTexture.value = this.pressure.read.texture;
    clear.uniforms.value.value = 0.8;
    this.renderPass(clear, this.pressure.write);
    this.pressure.swap();

    const pressure = this.materials.pressure;
    pressure.uniforms.uDivergence.value = this.divergenceTarget.texture;
    for (let i = 0; i < this.config.pressureIterations; i++) {
      pressure.uniforms.uPressure.value = this.pressure.read.texture;
      this.renderPass(pressure, this.pressure.write);
      this.pressure.swap();
    }

    // Subtract pressure gradient to make the velocity field divergence-free.
    const gradient = this.materials.gradient;
    gradient.uniforms.uPressure.value = this.pressure.read.texture;
    gradient.uniforms.uVelocity.value = this.velocity.read.texture;
    this.renderPass(gradient, this.velocity.write);
    this.velocity.swap();

    // Viscous diffusion (implicit Jacobi solve) — optional, off by default
    // (see DEFAULT_SIMULATION_CONFIG). This is what lets neighboring cells
    // actually pull on each other; dissipation alone only shrinks a cell
    // toward zero in place, it never equalizes it with its neighbors.
    if (this.config.viscosity > 0 && this.config.diffusionIterations > 0) {
      const clearCopy = this.materials.clear;
      clearCopy.uniforms.uTexture.value = this.velocity.read.texture;
      clearCopy.uniforms.value.value = 1.0;
      this.renderPass(clearCopy, this.diffusionSource);

      const cellSize = 1 / Math.max(this.simWidth, this.simHeight);
      const alpha = (cellSize * cellSize) / (this.config.viscosity * dt);
      const beta = 4 + alpha;

      const diffuse = this.materials.diffuse;
      diffuse.uniforms.uSource.value = this.diffusionSource.texture;
      diffuse.uniforms.alpha.value = alpha;
      diffuse.uniforms.beta.value = beta;
      for (let i = 0; i < this.config.diffusionIterations; i++) {
        diffuse.uniforms.uVelocity.value = this.velocity.read.texture;
        this.renderPass(diffuse, this.velocity.write);
        this.velocity.swap();
      }
    }

    // Advect velocity through itself, then advect dye through velocity.
    this.advectPass(this.velocity, this.config.velocityDissipation, dt, simTexel);
    this.advectPass(this.dye, this.config.densityDissipation, dt, dyeTexel);

    // Perpetual shimmer + relax-to-baseline: keeps the dye field covering
    // the full viewport with visible motion forever, whether or not the
    // user ever interacts, and pulls interaction bumps back to calm.
    const dyeNoise = this.materials.dyeNoise;
    dyeNoise.uniforms.uSource.value = this.dye.read.texture;
    dyeNoise.uniforms.time.value = time;
    this.renderPass(dyeNoise, this.dye.write);
    this.dye.swap();

    this.renderer.setRenderTarget(null);
  }

  /**
   * Injects a force + tint at a normalized (0..1) UV point into velocity and
   * dye fields. `direction` (need not be pre-normalized; the shader
   * normalizes) shapes the splat into a comet — compressed ahead of travel,
   * elongated behind it — instead of a circle; omit it (or leave it zero)
   * for the original isotropic splat. `elongation` (>1) controls how
   * pronounced that asymmetry is; 1 is a plain circle regardless of direction.
   */
  splat(
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: RGB,
    radiusScale = 1,
    direction: readonly [number, number] = [0, 0],
    elongation = 1,
  ) {
    const splat = this.materials.splat;
    splat.uniforms.radius.value = this.config.splatRadius * radiusScale;
    splat.uniforms.point.value.set(x, y);
    splat.uniforms.dir.value.set(direction[0], direction[1]);
    splat.uniforms.elongation.value = elongation;

    splat.uniforms.uTarget.value = this.velocity.read.texture;
    splat.uniforms.color.value.set(dx, dy, 0);
    this.renderPass(splat, this.velocity.write);
    this.velocity.swap();

    splat.uniforms.uTarget.value = this.dye.read.texture;
    splat.uniforms.color.value.set(color[0], color[1], color[2]);
    this.renderPass(splat, this.dye.write);
    this.dye.swap();

    this.renderer.setRenderTarget(null);
  }

  getDyeTexture(): THREE.Texture {
    return this.dye.read.texture;
  }

  getDyeSize(): { width: number; height: number } {
    return { width: this.dyeWidth, height: this.dyeHeight };
  }

  dispose() {
    this.velocity.dispose();
    this.dye.dispose();
    this.pressure.dispose();
    this.divergenceTarget.dispose();
    this.curlTarget.dispose();
    this.diffusionSource.dispose();
    this.quad.geometry.dispose();
    Object.values(this.materials).forEach((m) => m.dispose());
  }
}
