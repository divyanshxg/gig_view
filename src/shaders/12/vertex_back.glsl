#version 300 es
precision mediump float;
in vec2 uv;
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uPlane; 
uniform float wave_progress_2; 
uniform float uTime;
uniform float uRippleProgress1;
uniform float uRippleProgress2;
uniform float uRippleProgress3;

out vec2 vUv;


void main() {

    vUv = uv; // 0 to 1

    gl_Position = projectionMatrix * modelViewMatrix* vec4(position, 1.0);
}
