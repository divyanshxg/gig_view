#version 300 es
in vec2 uv;
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

// uniform vec2 uImage;
// uniform vec2 uPlane;
// uniform vec2 uResolution;
// uniform float uProgress;
// uniform float unblur_p;
// uniform float wave_progress_1; 
// uniform float wave_progress_2; 
// uniform float wave_progress_3; 
// uniform float uGlowIntensity;
// uniform float uDistortionIntensity;
// uniform float uBlurAmount;
// uniform float uBorderRadius;

out vec2 vUv;

void main(void) {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix* vec4(position, 1.0);
}
