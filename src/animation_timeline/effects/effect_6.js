import default_config from "./effect_0";
import gsap from "gsap"
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

let ease = CustomEase.create("custom", "M0,0 C0.272,0 0.657,0.231 0.681,0.272 0.759,0.406 0.744,0.947 1,0.947 ");
export default {
  ...default_config,
  glow_ease: ease,
  glow_delay: 0,
  distortion_delay: 0.45,
  back_wave_progress_1_ease: ease,
  back_wave_progress_1_timeline: "start+=0",


  // Updating 
  // try using custom ease for every thing
  front_scale_first_duration: 1.3,
  front_scale_ease: CustomEase.create("custom", "M0,0 C0.105,0 0.482,0.159 0.704,0.428 0.88,0.641 1,0.909 1,1 "),

  //going a little up
  front_position_one_duration: 1.1,


  // front_position_one_ease: "power2.in",
  front_position_one_ease: "power2.in",
  front_position_one_timeline: `start+=0`,

  //going a little down
  front_position_two_duration: 0.2,
  front_position_two_ease: "power2.in",
  front_position_two_timeline: `start+=${1.1}`,

  // Texture Stretch
  front_progress_duration: 2.2 - 1.3,
  front_progress_ease: CustomEase.create("custom", "M0,0 C0.109,0.196 0.537,0.781 1,1 "),
  front_progress_timeline: `start+=1.3`,

  // scaling down
  front_scale_second_duration: 1.5 - 1.3,
  front_scale_second_ease: CustomEase.create("custom", "M0,0 C0.109,0.196 0.537,0.781 1,1 "),
  front_scale_second_timeline: `start+=${1.3}`,


  //going out of view (up)
  front_position_three_duration: 2.3 - 1.5,
  front_position_three_ease: CustomEase.create("custom", "M0,0 C0.076,0 0.317,0.031 0.5,0.2 0.774,0.452 1,0.889 1,1 "),
  front_position_three_timeline: `start+=${1.35}`,


  //glow wave
  back_wave_progress_1_ease: CustomEase.create("custom", "M0,0 C0.06,0.271 0.509,0.068 0.698,0.274 0.836,0.424 0.925,0.717 1,1 "),
  back_wave_progress_1_duration: 3.0, // front_scale_first_duration
  back_wave_progress_1_timeline: `start+=0`,

  // glow Radius
  glow_radius_ease: CustomEase.create("custom", "M0,0 C0,0.082 0.156,1 0.322,1 0.409,1 0.568,1.068 0.66,0.911 0.745,0.764 0.67,0.116 0.866,0.116 0.999,0.116 0.951,0.1 1,0.1 "),
  glow_radius_duration: 3.0,
  glow_radius_timeline: "start+=0",

  //distortion wave
  // back_wave_progress_2_ease: CustomEase.create("custom", "M0,0 C0.06,0.271 0.509,0.068 0.698,0.274 0.836,0.424 0.925,0.717 1,1 "),
  back_wave_progress_2_ease: "power4.in",
  back_wave_progress_2_duration: 3.0, // front_scale_first_duration
  back_wave_progress_2_timeline: `start+=0.2`,


  // unblur
  back_unblur_duration: 0.7,
  back_unblur_ease: "none",
  back_unblur_timeline: `start+=${2.0}`,


  // notch animation
  notch_scale_duration: 2.3 - 1.5 + 0.3,
  notch_scale_ease: CustomEase.create("custom", "M0,0 C0,0.096 0.249,0.699 0.5,0.7 0.749,0.7 1,0.097 1,0 "),
  notch_scale_timeline: `start+=1.35`

};

