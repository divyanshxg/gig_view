void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    float t = mod(iTime,2.5); // 0->2
    t -= 1.;
    uv -= 0.5;
    uv *= 2.;
    uv.x *= iResolution.x/iResolution.y;
    float d = 1.- length(uv - vec2(0.,1.));
    // edge should go from 1 to -1
    //float d1 = 1. - step(d ,-t);
    float d1 = smoothstep(-t -0.4 , -t, d);
    float d2 = smoothstep(-t , -t+0.4, d);
    d = d1-d2;
    vec3 color = vec3(d);
    fragColor = vec4(color, 1.0);
} 
