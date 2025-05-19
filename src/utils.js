
import fragment_back_1 from './shaders/01/fragment_back.glsl';
import fragment_front_1 from './shaders/01/fragment_front.glsl';
import fragment_back_2 from './shaders/02/fragment_back.glsl';
import fragment_front_2 from './shaders/02/fragment_front.glsl';
import fragment_back_3 from './shaders/03/fragment_back.glsl';
import fragment_front_3 from './shaders/03/fragment_front.glsl';
import fragment_back_4 from './shaders/04/fragment_back.glsl';
import fragment_front_4 from './shaders/04/fragment_front.glsl';


const back_fragment = [fragment_back_1, fragment_back_2, fragment_back_3, fragment_back_4]
const front_fragment = [fragment_front_1, fragment_front_2, fragment_front_3, fragment_front_4]

export {
  front_fragment,
  back_fragment
}
