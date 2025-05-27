// Fragment Shaders

import fragment_back_0 from '../shaders/00/fragment_back.glsl';
import fragment_front_0 from '../shaders/00/fragment_front.glsl';
import fragment_back_1 from '../shaders/01/fragment_back.glsl';
import fragment_front_1 from '../shaders/01/fragment_front.glsl';
import fragment_back_2 from '../shaders/02/fragment_back.glsl';
import fragment_front_2 from '../shaders/02/fragment_front.glsl';
import fragment_back_3 from '../shaders/03/fragment_back.glsl';
import fragment_front_3 from '../shaders/03/fragment_front.glsl';
import fragment_back_4 from '../shaders/04/fragment_back.glsl';
import fragment_front_4 from '../shaders/04/fragment_front.glsl';
import fragment_back_5 from '../shaders/05/fragment_back.glsl';
import fragment_front_5 from '../shaders/05/fragment_front.glsl';
import fragment_back_6 from '../shaders/06/fragment_back.glsl';
import fragment_front_6 from '../shaders/06/fragment_front.glsl';
import fragment_back_7 from '../shaders/07/fragment_back.glsl';
import fragment_front_7 from '../shaders/07/fragment_front.glsl';
import fragment_back_8 from '../shaders/08/fragment_back.glsl';
import fragment_front_8 from '../shaders/08/fragment_front.glsl';

// Vertex Shaders

import vertex_back_0 from '../shaders/00/vertex_back.glsl';
import vertex_front_0 from '../shaders/00/vertex_front.glsl';
import vertex_back_1 from '../shaders/01/vertex_back.glsl';
import vertex_front_1 from '../shaders/01/vertex_front.glsl';
import vertex_back_2 from '../shaders/02/vertex_back.glsl';
import vertex_front_2 from '../shaders/02/vertex_front.glsl';
import vertex_back_3 from '../shaders/03/vertex_back.glsl';
import vertex_front_3 from '../shaders/03/vertex_front.glsl';
import vertex_back_4 from '../shaders/04/vertex_back.glsl';
import vertex_front_4 from '../shaders/04/vertex_front.glsl';
import vertex_back_5 from '../shaders/05/vertex_back.glsl';
import vertex_front_5 from '../shaders/05/vertex_front.glsl';
import vertex_back_6 from '../shaders/06/vertex_back.glsl';
import vertex_front_6 from '../shaders/06/vertex_front.glsl';
import vertex_back_7 from '../shaders/07/vertex_back.glsl';
import vertex_front_7 from '../shaders/07/vertex_front.glsl';
import vertex_back_8 from '../shaders/08/vertex_back.glsl';
import vertex_front_8 from '../shaders/08/vertex_front.glsl';


const back_fragment = [
  fragment_back_0,
  fragment_back_1,
  fragment_back_2,
  fragment_back_3,
  fragment_back_4,
  fragment_back_5,
  fragment_back_6,
  fragment_back_7,
  fragment_back_8,
];

const front_fragment = [
  fragment_front_0,
  fragment_front_1,
  fragment_front_2,
  fragment_front_3,
  fragment_front_4,
  fragment_front_5,
  fragment_front_6,
  fragment_front_7,
  fragment_front_8,
];

const back_vertex = [
  vertex_back_0,
  vertex_back_1,
  vertex_back_2,
  vertex_back_3,
  vertex_back_4,
  vertex_back_5,
  vertex_back_6,
  vertex_back_7,
  vertex_back_8
];

const front_vertex = [
  vertex_front_0,
  vertex_front_1,
  vertex_front_2,
  vertex_front_3,
  vertex_front_4,
  vertex_front_5,
  vertex_front_6,
  vertex_front_7,
  vertex_front_8,
];

export {
  front_fragment,
  back_fragment,
  front_vertex,
  back_vertex
}
