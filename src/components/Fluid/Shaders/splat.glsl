precision highp float;
precision highp sampler2D;

varying vec2 vUv;

uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
// Motion direction (unnormalized ok — normalized below) driving this splat's
// shape. (0,0) (the default) falls back to the original isotropic circle —
// existing callers that never set this are unaffected.
uniform vec2 dir;
// >1 stretches the trailing edge and compresses the leading edge along
// `dir`, turning the injection into a comet/teardrop instead of a circle.
// 1 = isotropic regardless of dir.
uniform float elongation;

void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;

  float dirLenSq = dot(dir, dir);
  float normSq;
  if (dirLenSq > 0.0001) {
    vec2 d = dir * inversesqrt(dirLenSq);
    vec2 perpDir = vec2(-d.y, d.x);
    float along = dot(p, d);
    float perp = dot(p, perpDir);
    // Ahead of the motion (along > 0): tighter falloff, a compressed leading
    // edge. Behind it (along < 0): wider falloff, a trailing tail that
    // stretches out — exactly the asymmetric "comet" shape real fluid being
    // dragged through leaves, instead of a shape that's merely a stretched
    // (but still front/back-symmetric) ellipse.
    float radiusAlong = along > 0.0 ? radius / elongation : radius * elongation;
    normSq = (along * along) / radiusAlong + (perp * perp) / radius;
  } else {
    normSq = dot(p, p) / radius;
  }

  vec3 splat = exp(-normSq) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
