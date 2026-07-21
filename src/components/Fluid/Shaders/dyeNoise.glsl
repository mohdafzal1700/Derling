precision highp float;
precision highp sampler2D;

varying vec2 vUv;

uniform sampler2D uSource;
uniform float time;
uniform float amplitude;
uniform float scale;
uniform float baseline;
uniform float relaxRate;

// Same low-frequency drifting-potential trick as ambient.glsl, applied
// directly to density instead of velocity, plus a slow pull back toward a
// baseline level. Together these keep the full-screen dye field from ever
// settling into a flat, motionless sheet (shimmer) or drifting to black/white
// over a long session (relax) — the surface stays alive indefinitely with no
// CPU-side upkeep.
float potential (vec2 p, float t) {
  return sin(p.x * scale + t * 0.18) * cos(p.y * scale * 1.24 - t * 0.13)
       + sin((p.x - p.y) * scale * 0.7 + t * 0.09) * 0.5;
}

void main () {
  vec3 c = texture2D(uSource, vUv).rgb;
  vec3 relaxed = mix(c, vec3(baseline), relaxRate);
  float n = potential(vUv, time) * amplitude;
  gl_FragColor = vec4(clamp(relaxed + vec3(n), 0.0, 1.0), 1.0);
}
