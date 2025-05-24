#version 300 es
precision mediump float;
in vec2 uv;
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uPlane; 
uniform float wave_progress_2; 
uniform float uTime;
out vec3 vPos;

out vec2 vUv;


void main() {

    vUv = uv; // 0 to 1

    vec2 normalized_uv = uv;
    normalized_uv -= 0.5;
    normalized_uv *= 2.0;

    // normalizing it
    normalized_uv.x *= uPlane.x/uPlane.y;




    vec3 m_position = position;

    gl_Position = projectionMatrix * modelViewMatrix* vec4(m_position, 1.0);
    vPos = (modelViewMatrix*vec4(position,1.0)).xyz;
}
