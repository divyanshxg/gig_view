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
uniform float uTextureStretch;



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

uv = vec2(uv.x -  0.012, uv.y);

// Wave 1 GLOW Accumulation
    float t = wave_progress_1*3.  - 1.5; // max value is 3.
    d = 1.0 - length(normalized_uv - vec2(0., 0.45*2.));// reusing variable d

  float glow_size = smoothstep(0.0, 0.5, wave_progress_1) * (1.0 - smoothstep(0.7, 1.0, wave_progress_1));
    // float d1 = smoothstep(-t -0.15 - 0.2*glow_size, -t, d);
    float d1 = smoothstep(-t -0.15 - 0.3*uGlowRadius , -t, d);
    float d2 = smoothstep(-t , -t+0.15 + 0.3*uGlowRadius , d);
    float d_glow = d1-d2;



// Wave 2 - Distortion Wave 

    t = uRippleWave*0.6; // reusing variable t

    // vec2 viewSize = uResolution;
    vec2 viewSize = uPlane;
    vec2 position = vUv * viewSize;

    vec2 position_yflip = vec2(position.x ,  position.y);
    float uv_y_dynamic_island_offset = 0.46;

    vec2 uv_d  =  position_yflip/viewSize;

    vec2 stretch_uv = vec2(uv.x, uv.y/(1.+uTextureStretch/12.) );
    vec4 texture_color = texture(uTexture , stretch_uv);

    // Initialize variables for the bang effect
    vec2 bang_offset = vec2(0.0); // Displacement offset for the bang effect
    float bang_d = 0.0;           // Intensity of the first bang wave

    if (t >= 0.0) {
        float aT = t - 0.0;       // Adjusted time (starts at 0 when bang begins)
        vec2 uv2 = uv_d;            // Copy UV coords for manipulation
        uv2 -= 0.5;               // Center UV coords around (0,0) by subtracting 0.5
        uv2.x *= viewSize.x / viewSize.y; // Adjust for aspect ratio to make effect circular
        // uv2.x -= 0.1;             // Slight horizontal shift for effect positioning

        vec2 uv_bang = vec2(uv2.x, uv2.y); // Store transformed UV coords
        vec2 uv_bang_origin = vec2(uv_bang.x, uv_bang.y - uv_y_dynamic_island_offset); // Set bang origin with Y offset
        bang_d = (aT * 0.16) / length(uv_bang_origin); // Calculate bang wave intensity based on distance from origin
        bang_d = smoothstep(0.09, 0.05, bang_d) * smoothstep(0.04, 0.07, bang_d) * (uv.y + 0.05); // Shape the wave with smoothstep and Y influence
        float off = 1.;
        bang_offset = vec2(-8.0*off * bang_d * uv2.x, -4.0*off * bang_d * (uv2.y - 0.4)) * 0.1; // Calculate displacement for first wave

        float bang_d2 = ((aT - 0.085) * 0.14) / length(uv_bang_origin); // Second wave, slightly delayed
        bang_d2 = smoothstep(0.09, 0.05, bang_d2) * smoothstep(0.04, 0.07, bang_d2) * (uv.y + 0.05); // Shape second wave similarly
        bang_offset += vec2(-8.0 * bang_d2 * uv2.x, -4.0 * bang_d2 * (uv2.y - 0.4)) * -0.02; // Add displacement for second wave
    }


    // Apply displacement to texture sampling
    vec2 uv_blast = stretch_uv + bang_offset; // Adjust UV coords with bang displacement
    texture_color = texture(uTexture, uv_blast); // Sample texture at displaced coords

    // Apply blur effect where bang is active
    if (bang_d > 0.0) {
        float Pi = 6.28318530718 * 2.0; // Define 2*PI for circular sampling
        float Directions = 20.0;        // Number of directions for blur sampling
        float Quality = 6.0;            // Number of samples per direction
        float Radius = bang_d * 0.08;   // Blur radius scales with bang intensity

        vec4 blurColor = vec4(0.0);     // Initialize blur color accumulator
        float totalSamples = 0.0;       // Track number of samples for averaging

        // Loop over directions and distances to sample blur
        for(float d = 0.0; d < Pi; d += Pi / Directions) {
            for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {
                vec2 blurPos = uv_blast + vec2(cos(d), sin(d)) * Radius * i; // Calculate blur sample position
                blurColor += texture(uTexture, blurPos); // Add sample to blur color
                totalSamples += 1.0; // Increment sample count
            }
        }
        blurColor /= totalSamples; // Average the blur samples

        // Blend original displaced color with blurred color based on bang intensity
        texture_color = mix(texture_color, blurColor, bang_d * 2.0);
    }

    // Enhance colors with a flash effect based on bang intensity and time
    texture_color = texture_color * (1.0 + bang_d * 3. * smoothstep(.05, .1, t));

    // vec2 distortion_offset = vec2(0.);
    vec3 tex = texture_color.xyz;


    float tex_down = uBlurAmount;
    vec3 blured = 1.06*gaus_blur(uTexture , stretch_uv , vec2(uImage.x * tex_down, uImage.y * tex_down) );



    vec3 final = mix(tex, blured , 1.0 - unblur_p);



    fragColor = vec4( final * (1.0 + (2.2*d_glow )*max(vUv.y,0.35) ), 1.0);
    // fragColor = vec4( final + uGlowRadius, 1.0);

    // fragColor = vec4(vColor ,1.0);

    // fragColor = vec4(step(0.45 + 0.033 ,vPos.yyy), 1.0);
}

