#define CIRCLE_CENTER vec2(0.9, 0.5)
#define MAX_RADIUS 0.5

float circleFast(vec2 st, vec2 pos, float r) {
    vec2 dist = st - pos;
  return 1. - smoothstep(r - (0.09), r + (0.09), dot(dist, dist) * 4.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float time = fract(iTime / 2.);
	vec2 uv = fragCoord.xy / iResolution.y;
  fragColor = vec4(uv, 0.5 + 0.5 * sin(iTime), 1.0);
  uv += 1. - (circleFast(uv, CIRCLE_CENTER, time * 2.) - circleFast(uv, CIRCLE_CENTER, (time / 1.3) * 2.))
    * (1. - clamp(distance(CIRCLE_CENTER, uv) * 1. / MAX_RADIUS, 0., 1.));
  fragColor = texture(iChannel0, uv);
}
