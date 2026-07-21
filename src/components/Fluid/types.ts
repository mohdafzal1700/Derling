export interface SimulationConfig {
  /** Resolution (longest edge, px) of the velocity/pressure/curl solve. Lower = faster, blobbier. */
  simResolution: number;
  /** Resolution (longest edge, px) of the visible dye/density field. Higher = crisper liquid. */
  dyeResolution: number;
  /** Exponential falloff of the dye field per second. Higher = liquid disappears faster. */
  densityDissipation: number;
  /** Exponential falloff of velocity per second. Higher = liquid settles/stops faster. */
  velocityDissipation: number;
  /** Jacobi iterations for the pressure Poisson solve. More = more incompressible, costs more. */
  pressureIterations: number;
  /** Vorticity confinement strength — higher adds more swirling detail. */
  curlStrength: number;
  /** Gaussian falloff radius (in normalized UV units) for injected splats. */
  splatRadius: number;
  /** Amplitude of the always-on ambient curl-noise force driving idle motion. */
  ambientAmplitude: number;
  /** Spatial frequency of the ambient curl-noise field. */
  ambientScale: number;
}

export interface PointerState {
  id: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  dx: number;
  dy: number;
  down: boolean;
  moved: boolean;
}

export type RGB = [number, number, number];
