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
uniform float wave_progress_3; 
uniform float uGlowIntensity;
uniform float uDistortionIntensity;
uniform float uBlurAmount;
uniform float uBorderRadius;
uniform float uGlowRadius;
uniform float uRippleProgress;
uniform float uRippleWidth;
uniform float uRippleWave;



in vec2 vUv;
out vec4 fragColor;

// Define RGB color constants using vec3 (a 3-component vector, typically for colors)
#define RED vec3(1.0, 0.0, 0.0)     // Defines 'RED' as a vec3 representing red color (R=1, G=0, B=0)
#define GREEN vec3(0.0, 1.0, 0.0)   // Defines 'GREEN' as a vec3 representing green color (R=0, G=1, B=0)
#define BLUE vec3(0.0, 0.0, 1.0)    // Defines 'BLUE' as a vec3 representing blue color (R=0, G=0, B=1)
#define WHITE vec3(1.0)             // Defines 'WHITE' as a vec3 representing white color (R=1, G=1, B=1). Shorthand for vec3(1.0, 1.0, 1.0).

#define PI 3.1415926535

// Maps a value from one range [min1, max1] to another [min2, max2]
float map(float min1, float max1, float value, float min2, float max2) {
    return min2 + ((value - min1) / (max1 - min1)) * (max2 - min2);
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
    // float d1 = smoothstep(-t -0.15 - 0.2*glow_size, -t, d);
    float d1 = smoothstep(-t -0.15 - 0.3*uGlowRadius , -t, d);
    float d2 = smoothstep(-t , -t+0.15 + 0.3*uGlowRadius , d);
    float d_glow = d1-d2;



// Wave 2 - Distortion Wave 

    // t = wave_progress_2*3. - 1.5; // max value is 2.5
    // // t = uRippleProgress *3. - 1.5;
    // d = 1.0 - length(normalized_uv - vec2(0., 0.9));// reusing variable d
    //
    // d1 = smoothstep(-t -0.15 , -t, d);
    // d2 = smoothstep(-t , -t+0.15  , d);
    //
    // float d_distortion = d1-d2;
    //
    // float decress_effect = uDistortionIntensity; 
    //
    // vec2 distortion_offset = d_distortion * normalize(normalized_uv - vec2(0., 0.9)) * decress_effect;
    // distortion_offset = vec2(0.);
    // vec3 tex = texture(uTexture, uv- distortion_offset).rgb;

    float smallerAxis = min(uPlane.x , uPlane.y);

    vec2 distortion_uv = vec2(vUv.x , vUv.y) - 0.5;
    distortion_uv = distortion_uv/smallerAxis;

    // Set the center of the ripple effect (Y-shifted slightly up)
    vec2 rippleCenter = vec2(0.0, 1.);

    // Duration for how long ripples are actively expanding
    float rippleDurationBase = 1.0;

    // Time between ripple events (pause between pulses)
    float rippleDurationWait = 0.7;

    // Full time for one complete ripple cycle (pulse + wait)
    float rippleTotalDuration = rippleDurationBase + rippleDurationWait;

    // Controls how tightly spaced the sine wave ripples are
    float frequency = 0.95;

    // Scales the frequency for final ripple appearance
    float waveOutputFreq = 1.2;

    // Vector from ripple center to current pixel in normalized space
    vec2 deltaFromCenter = distortion_uv - rippleCenter;

    // Unit vector pointing from the ripple center to this pixel
    vec2 dirFromCenter = normalize(deltaFromCenter);

    // Smoothing Out Ripple End
    
    float currentRippleTime = uRippleWave;

    float rippleProgress = currentRippleTime / rippleTotalDuration;

    float damping = smoothstep(1.5, 0.7, rippleProgress);


    // How much time is left in this cycle
    float remainingRippleTime = rippleTotalDuration - currentRippleTime;

    // Dynamically adjust the influence of distance over time
    // Ripples appear to grow or shrink depending on time in the cycle
    float lengthInfluence = map(rippleDurationBase, 0.0, currentRippleTime, 0.5, 0.5);

    // Use a sine wave to calculate the wave-like distortion strength at this pixel
    // Phase is based on time and distance from center
    float amplitude = sin(
        frequency * (
            (-length(deltaFromCenter) * lengthInfluence + currentRippleTime)
            * (2.0 * PI * waveOutputFreq) / rippleDurationBase
        )
    );

    // Attenuate the amplitude over time and with distance
    // Fades ripple edges and controls its visual decay
    amplitude *= (0.32 * remainingRippleTime) / (
        1.0 + (10.0 * lengthInfluence) + length(deltaFromCenter)
    );

    amplitude *= damping;

    // Create a falloff that is 1.0 at the center and 0.0 at the edges
    vec2 edgeFalloff = smoothstep(0.0, 0.2, vUv) * smoothstep(0.0, 0.2, 1.0 - vUv);
    float edgeAttenuation = edgeFalloff.x * edgeFalloff.y;

    // Reduce amplitude near edges
    amplitude *= edgeAttenuation;

    vec2 offsetUV = uv + dirFromCenter * amplitude;

    // Sample the distorted texture from the input channel
    vec3 tex = texture(uTexture , offsetUV).rgb;

    // vec3 tex = vec3(vUv ,0.0);


    // Blurred Texture

    float tex_down = uBlurAmount;
    vec3 blured = 1.06*gaus_blur(uTexture , uv, vec2(uImage.x * tex_down, uImage.y * tex_down) );

    //   float p = wave_progress_1;
    // float progressive_blur_factor = smoothstep(p-0.25 , p-0.05,1.0 - vUv.y );
    // progressive_blur_factor = mix( progressive_blur_factor , 0.0 ,  smoothstep(0.6,0.8, p ) );


    vec3 final = mix(tex, blured , 1.0 - unblur_p);



    fragColor = vec4( final * (1.0 + (2.2*d_glow )*max(vUv.y,0.35) ), 1.0);
}

