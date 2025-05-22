import gsap from "gsap"
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)
// this is the default or the effect_0 time line config
export default {
  // Existing wave configuration
  glow_delay: 0.7,
  glow_ease: "power3.inOut",
  distortion_delay: 0.5,

  // Front plane scale first sequence
  front_scale_first_duration: 1,
  front_scale_first_ease: "power1.inOut",
  front_scale_first_timeline: "start",

  // Front plane scale second sequence
  front_scale_second_duration: 0.3,
  front_scale_second_ease: "none",
  front_scale_second_timeline: "start+=0.9",

  // Front plane uProgress
  front_progress_duration: 1.1,
  front_progress_ease: "power4.inOut",
  front_progress_timeline: "start+=0.8",

  // Front plane position y
  front_position_y_duration: 1.2,
  front_position_y_ease: "power4.inOut",
  front_position_y_timeline: "start+=0.95",

  // Back plane unblur_p
  back_unblur_duration: 0.7,
  back_unblur_ease: "power1.inOut",
  back_unblur_timeline: "start+=1.2",

  // Back plane wave_progress_1
  back_wave_progress_1_duration: 2.5,
  back_wave_progress_1_ease: "power3.inOut", // Default, will be overridden if needed
  back_wave_progress_1_timeline: "start+=0.7", // Uses glow_delay

  // Back plane wave_progress_2
  back_wave_progress_2_duration: 3.0,
  back_wave_progress_2_ease: "power4.inOut",
  back_wave_progress_2_timeline: "start+=0.5" // Uses distortion_delay

}
