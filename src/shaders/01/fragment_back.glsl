#version 300 es
precision mediump float;

#define pow2(x) (x * x)
uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec2 uPlane;
uniform vec2 uResolution;
uniform float uProgress;
uniform float unblur_p;
uniform float wave_progress_1;
uniform float wave_progress_2;
uniform float uGlowIntensity;
uniform float uDistortionIntensity;
uniform float uBlurAmount;


in vec2 vUv;
out vec4 fragColor;



vec3 gaus_blur(sampler2D uTexture, vec2 uv, vec2 resolution) {
    const int radius = 3;
    const float pi = 3.1415926;
    const float sigma = 3.0;

    vec4 gaussSum = vec4(0.0);
    float weightSum = 0.0;
    vec2 texelSize = 1.0 / resolution; // Get the size of one pixel

    float m = 1.0;
    for (int x = -radius; x <= radius; x++) {
        for (int y = -radius; y <= radius; y++) {
            vec2 offset = vec2(float(x) * texelSize.x, float(y) * texelSize.y);
            vec2 sampleUV = uv + offset;

            float weight = exp(-(pow(float(x), 2.0) + pow(float(y), 2.0)) / (2.0 * pow(sigma, 2.0))) / (2.0 * pi * pow(sigma, 2.0));
            gaussSum += textureLod(uTexture, sampleUV, m) * weight;
            m = 6.;
            weightSum += weight;
        }
    }

    return (gaussSum / weightSum).rgb;
}



float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

void main(void) {
  // Rounded Corners
  vec2 normalized_uv = vUv;
  normalized_uv -= 0.5;
  normalized_uv *= 2.0;

  normalized_uv.x *= uPlane.x/uPlane.y;
  

  float d = length(normalized_uv);
  d = sdRoundedBox(normalized_uv , vec2(uPlane.x/uPlane.y,1.) , vec4(0.1));

  d = step(0.0,d);
  d = 1.0-d ;

  if(d == 0.0){
    discard;
  }

  //Texture and normalizing its UV
  vec2 ratio = vec2(
        min((uPlane.x / uPlane.y) / (uImage.x / uImage.y), 1.0),
        min((uPlane.y / uPlane.x) / (uImage.y / uImage.x), 1.0)
    );

vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );



// Wave 1 GLOW Wave
    float t = wave_progress_1 - 1.5; // max value is 2.5
    d = 1.0 - length(normalized_uv - vec2(0., 1.0));// reusing variable d


    float d1 = smoothstep(-t -0.4 , -t, d);
    float d2 = smoothstep(-t , -t+0.4, d);
    float d_glow = d1-d2;


// Wave 2 - Distortion Wave 
    t = wave_progress_2 - 1.5; // max value is 2.5
    d = 1.0 - length(normalized_uv - vec2(0., 1.0));// reusing variable d


    d1 = smoothstep(-t -0.4 , -t, d);
    d2 = smoothstep(-t , -t+0.4, d);
    float d_distortion = d1-d2;
    vec3 wave_1 = vec3(d_distortion);
    


    float decress_effect = uDistortionIntensity; // 0.01 -> 0.1
    float distortion_top_to_bottom =  smoothstep(0.01,0.2,vUv.y );
    vec3 tex = texture(uTexture, uv- decress_effect* d_distortion * distortion_top_to_bottom).rgb;

    float tex_down = uBlurAmount;
    vec3 blured = gaus_blur(uTexture , uv- decress_effect* d_distortion * distortion_top_to_bottom , vec2(uImage.x * tex_down, uImage.y * tex_down) );




    /////////////
    //Blur 


    vec3 final = mix(tex , blured , 1.0 - unblur_p);

    fragColor = vec4( final * (1.0 + uGlowIntensity*d_glow), 1.0);
  

  // gl_FragColor =  vec4(vUv , 0.0, 1.0); // Output red color
}

