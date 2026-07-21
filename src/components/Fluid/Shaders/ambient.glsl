precision highp float;
precision highp sampler2D;

varying vec2 vUv;

uniform sampler2D uVelocity;
uniform float time;
uniform float dt;
uniform float amplitude;
uniform float scale;

// Low-frequency pseudo curl-noise field: cheap, deterministic, GPU-only.
// Built from a smoothly drifting potential function so its gradient (rotated
// 90deg) is divergence-free, giving swirling "breathing" motion with no
// visible seams or repetition on screen-sized timescales.
float potential (vec2 p, float t) {
  return sin(p.x * scale + t * 0.5) * cos(p.y * scale * 1.3 - t * 0.37)
       + sin((p.x + p.y) * scale * 0.6 + t * 0.21) * 0.6;
}

void main () {
  vec2 p = vUv;
  float e = 0.015;
  float px = potential(p + vec2(e, 0.0), time) - potential(p - vec2(e, 0.0), time);
  float py = potential(p + vec2(0.0, e), time) - potential(p - vec2(0.0, e), time);

  vec2 curlForce = vec2(py, -px) * amplitude;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += curlForce * dt;
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
