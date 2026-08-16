precision highp float;
precision highp sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

// Implicit viscous diffusion (Stam, "Stable Fluids"): solves
// (I - ν∇²)x = b via Jacobi iteration instead of the unconditionally-
// unstable explicit form. `uSource` is the fixed pre-diffusion velocity
// (b, held constant across the whole iteration loop); `uVelocity` is the
// current iterate (x, starts equal to b, refined each pass). This is what
// makes neighboring fluid actually pull on each other — dissipation alone
// only shrinks a cell toward zero, it never lets adjacent cells equalize.
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float alpha;
uniform float beta;

void main () {
  vec2 L = texture2D(uVelocity, vL).xy;
  vec2 R = texture2D(uVelocity, vR).xy;
  vec2 T = texture2D(uVelocity, vT).xy;
  vec2 B = texture2D(uVelocity, vB).xy;
  vec2 b = texture2D(uSource, vUv).xy;
  vec2 result = (L + R + T + B + alpha * b) / beta;
  gl_FragColor = vec4(result, 0.0, 1.0);
}
