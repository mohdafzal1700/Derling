import * as THREE from "three";

/**
 * CSS `background-size: cover` equivalent for a texture sampled inside a
 * shader: returns the (scale, offset) pair so the image fills the target
 * aspect ratio without stretching, cropping symmetrically instead. Used only
 * for the blurred backdrop fill — the crisp product photo itself uses
 * `containTransform` so it's never cropped/zoomed.
 */
export function coverTransform(containerAspect: number, imageAspect: number) {
  let scaleX = 1;
  let scaleY = 1;

  if (containerAspect > imageAspect) {
    scaleY = imageAspect / containerAspect;
  } else {
    scaleX = containerAspect / imageAspect;
  }

  return {
    scale: new THREE.Vector2(scaleX, scaleY),
    offset: new THREE.Vector2((1 - scaleX) / 2, (1 - scaleY) / 2),
  };
}

/**
 * CSS `background-size: contain` equivalent: the whole image is always
 * visible, never cropped/zoomed. Returns the fraction of the viewport the
 * image actually occupies (scale, both axes <= 1) and its centering offset;
 * the shader maps screen UV into this rect and treats anything outside
 * [0,1] on either axis as "outside the photo" (filled by the backdrop).
 */
export function containTransform(containerAspect: number, imageAspect: number) {
  let scaleX = 1;
  let scaleY = 1;

  if (containerAspect > imageAspect) {
    scaleX = imageAspect / containerAspect;
  } else {
    scaleY = containerAspect / imageAspect;
  }

  return {
    scale: new THREE.Vector2(scaleX, scaleY),
    offset: new THREE.Vector2((1 - scaleX) / 2, (1 - scaleY) / 2),
  };
}

export const HERO_SHADER_DEFAULTS = {
  /** UV-space liquid displacement on the crisp foreground photo — kept small
   * so the product itself only bends, never smears out of recognition. */
  displacement: 0.012,
  /** Soft edge feather (vUv units) where the contained photo meets the
   * blurred backdrop, so the seam doesn't read as a hard-edged sticker. */
  edgeFeather: 0.018,
  /** UV-space sample radius for the cheap multi-tap backdrop blur. Was
   * 0.028 — soft enough to disguise the repeat when the backdrop was also
   * darkened, but with `backdropDarken` at 0 that same softness reads as an
   * obvious, out-of-place blur band in the letterboxed strip. Small enough
   * here that the backdrop is barely distinguishable from the crisp photo. */
  backdropBlurRadius: 0.004,
  /** How much the blurred backdrop is darkened/desaturated. Was 0.45 to read
   * as an ambient frame that never competes with the true-color photo, but on
   * a wide viewport (image contain-fit letterboxes top/bottom) that read as
   * flat black bars rather than an ambient frame — 0 lets the backdrop show
   * at the photo's own (now barely blurred) color instead, matching the
   * crisp photo closely enough that the letterboxed strip reads as a normal
   * continuation of it rather than a distinct band. */
  backdropDarken: 0,
  /** Amplifies the dye-gradient-derived normal into a visible bend. Lower
   * than the ambient milk layer's (14) so the liquid reads as a soft bulge
   * rather than a hard lens rim. */
  normalGain: 10,
  /** Width (in dye texels) of the central-difference sample used to derive
   * that normal. Wider = smoother, lower-frequency surface slope; 1 texel
   * reacts to a splat's sharp edge and reads as a lens boundary. */
  normalSampleScale: 2,
};
