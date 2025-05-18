
import fragment_back_1 from './shaders/01/fragment_back.glsl';
import fragment_front_1 from './shaders/01/fragment_front.glsl';
import fragment_back_2 from './shaders/02/fragment_back.glsl';
import fragment_front_2 from './shaders/02/fragment_front.glsl';

const back_fragment = [fragment_back_1, fragment_back_2]
const front_fragment = [fragment_front_1, fragment_front_2]

export {
  front_fragment,
  back_fragment
}

