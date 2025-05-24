// Fragment Shader
#version 300 es
precision highp float;

out vec4 color;
in vec2 vUv;
uniform vec2 uPlane;

float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}


void main() {
  vec2 normalized_uv = vUv;
  normalized_uv -= 0.5;
  normalized_uv *= 2.0;

  normalized_uv.x *= uPlane.x/uPlane.y;
  

  float d = length(normalized_uv);
  d = sdRoundedBox(normalized_uv , vec2(uPlane.x/uPlane.y,1.) , vec4( 1.1 ));

  d = step(0.0,d);
  d = 1.0-d ;

  if(d == 0.0){
    discard;
  }
    color = vec4(0.0, 0.0, 0.0, 1.0); // Black color
}
