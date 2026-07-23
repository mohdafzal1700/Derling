precision highp float;
precision highp sampler2D;

varying vec2 vUv;

// The real product photograph, sampled twice: once crisp and uncropped for
// the actual product (object-fit: contain, never zoomed), once heavily
// blurred and cover-fit purely as an ambient backdrop so the frame is never
// empty. Only the crisp copy is displaced by the liquid field — the photo's
// own colors are never tinted/re-lit, so what you see is what was authored.
uniform sampler2D uPhoto;
uniform sampler2D uDye;
uniform vec2 texelSize;

uniform vec2 uFitScale;
uniform vec2 uFitOffset;
uniform vec2 uBgScale;
uniform vec2 uBgOffset;

uniform float uDisplacement;
uniform float uEdgeFeather;
uniform float uBackdropBlurRadius;
uniform float uBackdropDarken;

vec3 sampleBlurredBackdrop(vec2 uv) {
  // Fixed 8-tap circular kernel — cheap, no dependent texture reads beyond
  // this, plenty soft at the radii this is actually used at.
  const int TAPS = 8;
  const float TAU = 6.28318530718;
  vec3 sum = texture2D(uPhoto, uv).rgb;
  float total = 1.0;
  for (int i = 0; i < TAPS; i++) {
    float angle = (float(i) / float(TAPS)) * TAU;
    vec2 offset = vec2(cos(angle), sin(angle)) * uBackdropBlurRadius;
    sum += texture2D(uPhoto, clamp(uv + offset, 0.0, 1.0)).rgb;
    total += 1.0;
  }
  return sum / total;
}

void main () {
  // Fake surface normal from the fluid dye field's density gradient — the
  // same trick the ambient milk layer uses — drives the liquid bend, kept
  // separate from photo color entirely.
  float L = texture2D(uDye, vUv - vec2(texelSize.x, 0.0)).r;
  float R = texture2D(uDye, vUv + vec2(texelSize.x, 0.0)).r;
  float T = texture2D(uDye, vUv + vec2(0.0, texelSize.y)).r;
  float B = texture2D(uDye, vUv - vec2(0.0, texelSize.y)).r;
  float gain = 14.0;
  vec3 normal = normalize(vec3((L - R) * gain, (B - T) * gain, 0.6));

  // Map screen UV into the contained photo's local space; outside [0,1] on
  // either axis means "not on the photo" — filled by the backdrop below.
  vec2 localUv = (vUv - uFitOffset) / uFitScale;
  vec2 displacedLocal = localUv + normal.xy * uDisplacement;
  vec3 photoColor = texture2D(uPhoto, clamp(displacedLocal, 0.0, 1.0)).rgb;

  float maskX = smoothstep(0.0, uEdgeFeather, localUv.x) * smoothstep(0.0, uEdgeFeather, 1.0 - localUv.x);
  float maskY = smoothstep(0.0, uEdgeFeather, localUv.y) * smoothstep(0.0, uEdgeFeather, 1.0 - localUv.y);
  float photoMask = maskX * maskY;

  vec2 bgUv = vUv * uBgScale + uBgOffset;
  vec3 backdrop = sampleBlurredBackdrop(clamp(bgUv, 0.0, 1.0));
  float luma = dot(backdrop, vec3(0.299, 0.587, 0.114));
  backdrop = mix(backdrop, vec3(luma), 0.4) * (1.0 - uBackdropDarken);

  vec3 color = mix(backdrop, photoColor, photoMask);
  gl_FragColor = vec4(color, 1.0);
}
