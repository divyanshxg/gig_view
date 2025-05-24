#version 300 es
precision mediump float;

// Definitions
#define PI 3.1415926
#define pow2(x) (x * x)


uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec2 uPlane;
uniform vec2 uResolution;
uniform float uProgress;
uniform float unblur_p;
uniform float wave_progress_1; 
uniform float wave_progress_2; 
uniform float wave_progress_3; 
uniform float uGlowIntensity;
uniform float uDistortionIntensity;
uniform float uBlurAmount;
uniform float uBorderRadius;
uniform float uGlowRadius;


in vec2 vUv;
in vec3 vPos;
out vec4 fragColor;

vec2 centerScaleUV(vec2 UV, vec2 factor) {
    return (UV - vec2(0.5)) * factor + vec2(0.5);
}


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
            m = 7.;
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

void main() {
  // Rounded Corners
  vec2 normalized_uv = vUv;
  normalized_uv -= 0.5;
  normalized_uv *= 2.0;

  normalized_uv.x *= uPlane.x/uPlane.y;
  

  float d = length(normalized_uv);
  d = sdRoundedBox(normalized_uv , vec2(uPlane.x/uPlane.y,1.) , vec4( uBorderRadius ));

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


// Wave 1 GLOW Accumulation
    float t = wave_progress_1*3.  - 1.5; // max value is 3.
    d = 1.0 - length(normalized_uv - vec2(0., 0.45*2.));// reusing variable d

  float glow_size = smoothstep(0.0, 0.5, wave_progress_1) * (1.0 - smoothstep(0.7, 1.0, wave_progress_1));
    float d1 = smoothstep(-t -0.15 - 0.3*uGlowRadius , -t, d);
    float d2 = smoothstep(-t , -t+0.15 + 0.3*uGlowRadius , d);
    float d_glow = d1-d2;



// Wave 2 - Distortion Wave 
    float force = 0.04;
    float thickness = 0.045;
    float feathering = 0.1 + wave_progress_2/10.;
    float aberrationOffset = 0.02;


    float pos = wave_progress_2;

    float aspectRatio = uPlane.x/uPlane.y;

    vec2 scalingFactor = vec2(aspectRatio, 1.0);

    scalingFactor *= 2.0;
    scalingFactor *= 1.0 - thickness - feathering; 

    float diagonal = sqrt(pow(aspectRatio, 2.0) + 1.0);

    scalingFactor /= diagonal; 
    vec2 scaledUV = centerScaleUV(vUv , scalingFactor);

    vec2 displacement = normalize(scaledUV - vec2(0.5 , 1.0)) * force;

    float distance_v = 0.4*distance(scaledUV, vec2(0.5, 1.0));

    float innerBound = smoothstep(
        pos - thickness - feathering, // start fading in before inner edge
        pos - thickness,              // fully opaque at inner edge
        distance_v
    );

    float outerBound = smoothstep(
        pos - feathering,  // start fading out
        pos,               // fully invisible at outer edge
        distance_v
    );

    float shapeMask = innerBound - outerBound;

    // float rChannel = texture(uTexture, screenUV - (displacement - aberrationOffset) * shapeMask).x;
    // float bChannel = texture(uTexture, screenUV - displacement * shapeMask).y;
    // float gChannel = texture(uTexture, screenUV - (displacement + aberrationOffset) * shapeMask).z;
    float rChannel = texture(uTexture, uv - (displacement - aberrationOffset) * shapeMask).x;
    float bChannel = texture(uTexture, uv - displacement * shapeMask).y;
    float gChannel = texture(uTexture, uv - (displacement + aberrationOffset) * shapeMask).z;

    vec3 color = vec3(rChannel, bChannel, gChannel);

    vec3 tex_color = texture(uTexture, uv - (displacement - aberrationOffset) * shapeMask).xyz;


    vec2 distortion_offset = vec2(0.0);

    // vec3 tex = texture(uTexture, uv - distortion_offset).rgb;
    vec3 tex = tex_color;

    float tex_down = uBlurAmount;
    // vec3 blured = 1.06*gaus_blur(uTexture , uv- decress_effect* d_distortion * distortion_top_to_bottom , vec2(uImage.x * tex_down, uImage.y * tex_down) );
    vec3 blured = 1.06*gaus_blur(uTexture , uv, vec2(uImage.x * tex_down, uImage.y * tex_down) );

    vec3 final = mix(tex , blured , 1.0 - unblur_p);



    fragColor = vec4( final * (1.0 + (2.2*d_glow )*max(vUv.y,0.35) ), 1.0);
    // fragColor = vec4( final + uGlowRadius, 1.0);


    // fragColor = vec4(step(0.45 + 0.033 ,vPos.yyy), 1.0);
}

