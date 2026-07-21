precision highp float;
precision highp sampler2D;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 texelSize;
uniform vec3 baseColor;
uniform vec3 highlightColor;

void main () {
  float density = clamp(texture2D(uTexture, vUv).r, 0.0, 1.0);

  // Fake surface normal from the density gradient so the liquid reads as a
  // lit, shaded volume (thick milk/paint) instead of a flat color mask. The
  // full-screen field only varies by a few percent locally, so the raw
  // gradient is amplified — otherwise the shading is too subtle to read.
  float L = texture2D(uTexture, vUv - vec2(texelSize.x, 0.0)).r;
  float R = texture2D(uTexture, vUv + vec2(texelSize.x, 0.0)).r;
  float T = texture2D(uTexture, vUv + vec2(0.0, texelSize.y)).r;
  float B = texture2D(uTexture, vUv - vec2(0.0, texelSize.y)).r;
  float gain = 14.0;
  vec3 normal = normalize(vec3((L - R) * gain, (B - T) * gain, 0.6));
  vec3 lightDir = normalize(vec3(0.35, 0.55, 0.75));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
  float specular = pow(diffuse, 24.0);

  // The density level itself also drives base tone, so slow-moving swells
  // in the field are visible even where the local gradient is flat. The
  // field's actual range sits near its baseline (~0.3-0.5) with only small
  // excursions, so the window is narrow — otherwise everything clusters at
  // one end of the gradient and reads as flat, motionless color.
  float tone = smoothstep(0.28, 0.9, density);
  vec3 color = mix(baseColor, highlightColor, clamp(tone * 0.75 + diffuse * 0.35 + specular * 0.6, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
