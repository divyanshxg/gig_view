#define CENTER vec2(0.5, 0.5)
#define PI 3.1415926

#define force 0.08
#define thickness 0.075
#define feathering 0.1
#define aberrationOffset 0.006
#define flashIntensity 3.0

// Scale UV from the screen's center by a factor
vec2 centerScaleUV(vec2 UV, vec2 factor) {
  return (UV - vec2(0.5)) * factor + vec2(0.5);
}

float easeOutSine(float t) {
  return sin((t * PI) / 2.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 screenUV = fragCoord / iResolution.xy;
    float pos = easeOutSine(iTime - floor(iTime));
    
    float aspectRatio = iResolution.x / iResolution.y;
    // Perform various scalings to allow the screen to be inscribed on the inner
    // bound of a shockwave of diameter 1:
    //  * Multiply by aspect ratio to remove stretching
    vec2 scalingFactor = vec2(aspectRatio, 1.0);
  //  * Convert from diameter to radius
  scalingFactor *= 2.0;
  //  * Subtract thickness and feathering to change perspective to inside bound
  //    of shockwave
  scalingFactor *= 1.0 - thickness - feathering;
  //  * Causes inside bound to be tangent to screen edge at corners rather than
  //    at the middle of top and bottom edge.
  scalingFactor /= sqrt(pow(aspectRatio, 2.0) + 1.0);
    vec2 scaledUV = centerScaleUV(screenUV, scalingFactor);

    vec2 displacement = normalize(scaledUV - CENTER) * force;
    float distance = distance(scaledUV, CENTER);

    float innerBound = smoothstep(
    pos - thickness - feathering,
    pos - thickness,
    distance
  );
    float outerBound = smoothstep(
    pos - feathering,
    pos,
    distance
  );
    float shapeMask = innerBound - outerBound;

    float rChannel = texture(iChannel0, screenUV - (displacement - aberrationOffset) * shapeMask).x;
    float bChannel = texture(iChannel0, screenUV - displacement * shapeMask).y;
    float gChannel = texture(iChannel0, screenUV - (displacement + aberrationOffset) * shapeMask).z;

    vec3 color = vec3(rChannel, bChannel, gChannel);

    // f(0) = 1, f(1) = 0, f'(1) = 0, and decreases fast
    float flashOpacity = pow(1.0 - pos, 4.0);
    // Flash is shown only inside the shockwave
    float flashMask = 1.0 - innerBound;
  color += flashIntensity * color * flashMask * flashOpacity;

  fragColor = vec4(color, 1.0);
}
