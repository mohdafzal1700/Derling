precision highp float;

varying vec2 vUv;

uniform float value;

// Writes a flat constant density everywhere — used once to give the dye
// field a full-screen baseline before any flow/noise is layered on top.
void main () {
  gl_FragColor = vec4(vec3(value), 1.0);
}
