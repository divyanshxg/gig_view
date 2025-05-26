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
uniform float uFallOff;
out vec3 vPos;

out vec2 vUv;
out vec3 vColor;


void main() {

    vUv = uv; // 0 to 1

    vec2 normalized_uv = uv;
    normalized_uv -= 0.5;
    normalized_uv *= 2.0;

    // normalizing it
    normalized_uv.x *= uPlane.x/uPlane.y;

    vec3 pos = position;
    float progress1 = smoothstep(0.,0.25 ,uRippleProgress1) * uRippleProgress1;
    float progress2 = smoothstep(0.,0.25 ,uRippleProgress2) * uRippleProgress2;
    // float progress3 = smoothstep(0.,0.35 ,uRippleProgress3) * uRippleProgress3;
    float t1 = progress1 * 4.5 - 2.; // Base time parameter
    float t2 = progress2 * 4.5 - 2.; // Base time parameter
    // float t3 = progress3 * 4.5 - 2.; // Base time parameter
    float d = 1.0 - length(normalized_uv - vec2(0.0, 0.9)); // Distance from ripple center

    // First ripple (original)
    float d1_1 = smoothstep(-t1 - 0.6, -t1, d);
    float d2_1 = smoothstep(-t1, -t1 + 0.6, d);
    float d1_2 = smoothstep(-t2 - 0.7, -t2, d);
    float d2_2 = smoothstep(-t2, -t2 + 0.7, d);
    // float d1_3 = smoothstep(-t3 - 1., -t3, d);
    // float d2_3 = smoothstep(-t3, -t3 + 1., d);
    float d_distortion = 0.0;

    // Edge-based attenuation: strong in center, weak near edges
    vec2 falloff = smoothstep(-0.2, uFallOff , uv) * smoothstep(-0.2, uFallOff, 1.0 - uv);
    float baseAmplitudeFalloff = falloff.x * falloff.y;

    // baseAmplitudeFalloff = 1.;

    d_distortion += (d1_1 - d2_1) * 0.2 * baseAmplitudeFalloff;
    d_distortion += (d1_2 - d2_2) * 0.05 * baseAmplitudeFalloff;
    // d_distortion += (d1_2 - d2_2)*0.1;
    // d_distortion += (d1_3 - d2_3)*0.06;

    // // Create a falloff mask that is 1.0 at the center and fades to 0.0 at the edges
    // vec2 edgeFalloff = smoothstep(0.0, 0.05, uv) * smoothstep(0.0, 0.05, 1.0 - uv);
    // float attenuation = edgeFalloff.x * edgeFalloff.y;
    //
    // // Apply attenuation to distortion
    // d_distortion *= attenuation;
    pos.z = -d_distortion ;

    vColor = vec3(d_distortion);
    gl_Position = projectionMatrix * modelViewMatrix* vec4(pos, 1.0);
    vPos = (modelViewMatrix*vec4(position,1.0)).xyz;
}
