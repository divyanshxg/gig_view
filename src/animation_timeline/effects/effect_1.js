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
};


