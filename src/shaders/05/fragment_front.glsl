#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec2 uPlane;

uniform float uProgress;
uniform float uBorderRadius;

in vec2 vUv;
out vec4 fragColor;

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
  d = sdRoundedBox(normalized_uv , vec2(uPlane.x/uPlane.y,1.) , vec4(uBorderRadius));

  d = step(0.0,d);
  d = 1.0-d ;

  if(d == 0.0){
    discard;
  }
  
  ///////


  //Texture and normalizing its UV
  vec2 ratio = vec2(
        min((uPlane.x / uPlane.y) / (uImage.x / uImage.y), 1.0),
        min((uPlane.y / uPlane.x) / (uImage.y / uImage.x), 1.0)
    );

vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );


  float scaleFactor = mix(1.0, 2.0, uProgress); // Scales from 1x to 2x
  vec2 scaledUv = uv;
  scaledUv.y = uv.y/mix(1.0 , scaleFactor , (vUv.y + uProgress*(uProgress+0.5)*0.4/uProgress  ) );

  vec3 tex = texture(uTexture , scaledUv ).rgb;

  fragColor =  vec4(tex, 1.0); // Output red color
}


