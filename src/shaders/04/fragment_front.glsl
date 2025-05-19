#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec2 uPlane;

uniform float uProgress;

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
  d = sdRoundedBox(normalized_uv , vec2(uPlane.x/uPlane.y,1.) , vec4(0.1));

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
  scaledUv.y = uv.y/mix(1.0 , scaleFactor , (vUv.y + uProgress*0.4) );

  // vec3 tex = texture(uTexture , vec2(uv.x, (uv.y +0.5)/(uProgress*7.+1.) - 0.5 )).rgb;
  // float distortion_effect = smoothstep(0.0,1.5, vUv.y );
  // vec3 tex = texture(uTexture , vec2(uv.x, uv.y*(1.0 - uProgress*0.5))).rgb;
  vec3 tex = texture(uTexture , scaledUv ).rgb;

  

  fragColor =  vec4(tex, 1.0); // Output red color
  // gl_FragColor =  vec4(vUv, 0.0, 1.0); // Output red color
}


  // normalized_uv.x *= uPlane.x/uPlane.y;

  // float dist = roundedRectangleSDF( normalized_uv , min_r , max_r , radius);

  // Apply a threshold to create the border
  // float threshold = 0.01;
  // if (abs(dist) < threshold) {
  //   gl_FragColor= vec4(1.0, 0.0, 0.0, 1.0); // Border color
  // } else {
  //   gl_FragColor= vec4(1.0, 1.0, 1.0, 1.0); // Background color
  // }

  // d = step(uPlane.x/uPlane.y ,d); // full circle at center(normalized)

