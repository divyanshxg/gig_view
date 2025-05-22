import default_config from "./effect_0";
import gsap from "gsap"
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

let stretch_ease = CustomEase.create("custom", "M0,0 C0.048,0 0.195,0.086 0.29,0.272 0.432,0.551 0.579,0.969 0.73,0.969 0.817,0.969 0.861,0 0.921,-0.285 0.954,-0.439 0.977,0 1,0 ");
let ease = CustomEase.create("custom", "M0,0 C0.069,0.21 0.274,0.039 0.507,0.25 0.592,0.327 0.564,0.591 0.626,0.732 0.652,0.792 0.677,0.838 0.728,0.875 0.822,0.945 0.97,0.915 1,0.915 ")      // let ease = CustomEase.create("custom", "M0,0 C0.069,0.21 0.274,0.039 0.507,0.25 0.592,0.327 0.582,0.612 0.644,0.753 0.67,0.813 0.7,0.874 0.751,0.911 0.845,0.981 0.97,1 1,1 ")

export default {
  ...default_config,
  glow_ease: ease,
  glow_delay: 0.,
  distortion_delay: -0.0,
  back_wave_progress_1_ease: ease,
  back_wave_progress_1_timeline: "start+=0.32",
  back_wave_progress_2_timeline: "start+=0.32",
  back_wave_progress_stretch_ease: stretch_ease,
  back_wave_stretch_timeline: "start+=0.95",
  back_wave_stretch_duration: 0.8
};


