import gsap from 'gsap'
import effect0 from './effects/effect_0.js'
import effect1 from './effects/effect_1.js'
import effect2 from './effects/effect_2.js'
import effect3 from './effects/effect_3.js'
import effect4 from './effects/effect_4.js'


const effects = [effect0, effect1, effect2, effect3, effect4]

export default function animationTimeline(front_plane, back_plane, index) {

  let tl = gsap.timeline()

  let timeline_config = effects[index]


  tl.to(front_plane.scale, {
    x: 0.4,
    y: 0.4,
    duration: timeline_config.front_scale_first_duration,
    ease: timeline_config.front_scale_first_ease
  }, timeline_config.front_scale_first_timeline);

  tl.to(front_plane.position, {
    y: 0.02,
    duration: timeline_config.front_position_one_duration,
    ease: timeline_config.front_position_one_ease
  }, timeline_config.front_position_one_timeline);

  tl.to(front_plane.position, {
    y: -0.00,
    duration: timeline_config.front_position_two_duration,
    ease: timeline_config.front_position_two_ease
  }, timeline_config.front_position_two_timeline);

  tl.to(front_plane.program.uniforms.uProgress, {
    value: 2.,
    duration: timeline_config.front_progress_duration,
    ease: timeline_config.front_progress_ease
  }, timeline_config.front_progress_timeline);

  tl.to(front_plane.scale, {
    y: 0.37,
    x: 0.35,
    duration: timeline_config.front_scale_second_duration,
    ease: timeline_config.front_scale_second_ease
  }, timeline_config.front_scale_second_timeline);

  tl.to(front_plane.position, {
    y: 1,
    duration: timeline_config.front_position_three_duration,
    ease: timeline_config.front_position_three_ease
  }, timeline_config.front_position_three_timeline);

  if (index == 4) {

    tl.to(back_plane.program.uniforms.wave_progress_1, {
      value: 1, // reduce its effect to 3.* 0.18
      ease: timeline_config.back_wave_progress_1_ease,
      duration: timeline_config.back_wave_progress_1_duration
    }, timeline_config.back_wave_progress_1_timeline);

    tl.to(back_plane.program.uniforms.wave_progress_1, {
      value: 0.0, // reduce its effect to 3.* 0.18
      ease: timeline_config.back_wave_progress_1_down_ease,
      duration: timeline_config.back_wave_progress_1_down_duration
    }, timeline_config.back_wave_progress_1_down_timeline);

    tl.to(back_plane.program.uniforms.wave_progress_2, {
      value: 1.0,
      ease: timeline_config.back_wave_progress_2_ease,
      duration: timeline_config.back_wave_progress_2_duration
    }, timeline_config.back_wave_progress_2_timeline);


  }
  else {

    tl.to(back_plane.program.uniforms.wave_progress_1, {
      value: 1, // reduce its effect to 3.* 0.18
      ease: timeline_config.back_wave_progress_1_ease,
      duration: timeline_config.back_wave_progress_1_duration
    }, timeline_config.back_wave_progress_1_timeline);

    tl.to(back_plane.program.uniforms.wave_progress_2, {
      value: 1.0,
      ease: timeline_config.back_wave_progress_2_ease,
      duration: timeline_config.back_wave_progress_2_duration
    }, timeline_config.back_wave_progress_2_timeline);

  }

  tl.to(back_plane.program.uniforms.unblur_p, {
    value: 1,
    duration: timeline_config.back_unblur_duration,
    ease: timeline_config.back_unblur_ease
  }, timeline_config.back_unblur_timeline);


  if (index === 3) {

    tl.to(back_plane.program.uniforms.uTextureStretch, {
      value: 1.,
      duration: timeline_config.back_wave_stretch_duration,
      ease: timeline_config.back_wave_progress_stretch_ease
    }, timeline_config.back_wave_stretch_timeline)

  }


  return tl
}

