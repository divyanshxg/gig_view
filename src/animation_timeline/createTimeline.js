import gsap from 'gsap'
import effect0 from './effects/effect_0.js'
import effect1 from './effects/effect_1.js'
import effect2 from './effects/effect_2.js'
import effect3 from './effects/effect_3.js'
import effect4 from './effects/effect_4.js'
import effect5 from './effects/effect_5.js'
import effect6 from './effects/effect_6.js'
import effect7 from './effects/effect_7.js'
import effect8 from './effects/effect_8.js'
import effect9 from './effects/effect_9.js'
import effect10 from './effects/effect_10.js'
import effect11 from './effects/effect_11.js'
import effect12 from './effects/effect_12.js'
import effect13 from './effects/effect_13.js'
import effect14 from './effects/effect_14.js'


const effects = [effect0, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11, effect12, effect13, effect14]

export default function animationTimeline(front_plane, back_plane, notch, index, guiConfig) {

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


  tl.to(back_plane.program.uniforms.wave_progress_1, {
    value: 1, // reduce its effect to 3.* 0.18
    ease: timeline_config.back_wave_progress_1_ease,
    duration: timeline_config.back_wave_progress_1_duration
  }, timeline_config.back_wave_progress_1_timeline);

  if (index == 5 || index == 6 || index == 7 || index == 8 || index == 9 || index == 10 || index == 11 || index == 12) {
    tl.to(back_plane.program.uniforms.uGlowRadius, {
      value: 1, // reduce its effect to 3.* 0.18
      ease: timeline_config.glow_radius_ease,
      duration: timeline_config.glow_radius_duration
    }, timeline_config.glow_radius_timeline);

  }

  if (index == 13) {
    tl.to(back_plane.program.uniforms.uGlowRadius, {
      value: 1, // reduce its effect to 3.* 0.18
      ease: timeline_config.glow_radius_ease,
      duration: timeline_config.glow_radius_duration
    }, timeline_config.glow_radius_timeline);
  }
  if (index == 14) {
    tl.to(back_plane.program.uniforms.uGlowRadius, {
      value: 1, // reduce its effect to 3.* 0.18
      ease: timeline_config.glow_radius_ease,
      duration: timeline_config.glow_radius_duration
    }, timeline_config.glow_radius_timeline);
  }


  tl.to(back_plane.program.uniforms.wave_progress_2, {
    value: 1.0,
    ease: timeline_config.back_wave_progress_2_ease,
    duration: timeline_config.back_wave_progress_2_duration
  }, timeline_config.back_wave_progress_2_timeline);


  tl.to(notch.scale, {
    x: 0.18,
    y: 0.05,
    ease: timeline_config.notch_scale_ease,
    duration: timeline_config.notch_scale_duration
  }, timeline_config.notch_scale_timeline)



  tl.to(back_plane.program.uniforms.unblur_p, {
    value: 1,
    duration: timeline_config.back_unblur_duration,
    ease: timeline_config.back_unblur_ease
  }, timeline_config.back_unblur_timeline);


  // if (index ==3 || index == 5 || index == 6 || index == 7) {

  tl.to(back_plane.program.uniforms.uTextureStretch, {
    value: 1.,
    duration: timeline_config.back_wave_stretch_duration,
    ease: timeline_config.back_wave_progress_stretch_ease
  }, timeline_config.back_wave_stretch_timeline)

  // }

  if (index == 5 || index == 6 || index == 7 || index == 8 || index == 9 || index == 10 || index == 11 || index == 12) {
    tl.to(back_plane.program.uniforms.uRippleProgress1, {
      value: 1,
      duration: timeline_config.back_wave_ripple_1_progress_duration,
      ease: timeline_config.back_wave_ripple_1_progress_ease
    }, timeline_config.back_wave_ripple_1_progress_timeline)

    tl.to(back_plane.program.uniforms.uRippleProgress2, {
      value: 1,
      duration: timeline_config.back_wave_ripple_2_progress_duration,
      ease: timeline_config.back_wave_ripple_2_progress_ease
    }, timeline_config.back_wave_ripple_2_progress_timeline)

    tl.to(back_plane.program.uniforms.uRippleProgress3, {
      value: 1,
      duration: timeline_config.back_wave_ripple_3_progress_duration,
      ease: timeline_config.back_wave_ripple_3_progress_ease
    }, timeline_config.back_wave_ripple_3_progress_timeline)

    tl.to(back_plane.program.uniforms.uRippleWidth, {
      value: 1,
      duration: timeline_config.back_wave_ripple_width_duration,
      ease: timeline_config.back_wave_ripple_width_ease
    }, timeline_config.back_wave_ripple_width_timeline)
  }

  if (index == 5 || index == 6 || index == 7 || index == 8) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      // value: timeline_config.back_plane_ripple_wave_duration,
      value: timeline_config.back_plane_ripple_wave_duration,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)
  }

  if (index == 14) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      value: timeline_config.back_plane_ripple_wave_duration,
      // value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)
  }
  if (index == 13) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      // value: timeline_config.back_plane_ripple_wave_duration,
      value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)
  }
  if (index == 12) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      value: timeline_config.back_plane_ripple_wave_duration,
      // value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)
  }

  if (index == 11) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      // value: timeline_config.back_plane_ripple_wave_duration,
      value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)
  }

  if (index == 10) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      value: timeline_config.back_plane_ripple_wave_duration,
      // value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)
  }
  if (index == 10) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      value: timeline_config.back_plane_ripple_wave_duration,
      // value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)
  }

  if (index == 9) {
    tl.to(back_plane.program.uniforms.uRippleWave, {
      // value: timeline_config.back_plane_ripple_wave_duration,
      value: 1.0,
      duration: timeline_config.back_plane_ripple_wave_duration,
      ease: timeline_config.back_plane_ripple_wave_ease
    }, timeline_config.back_plane_ripple_wave_timeline)

    tl.to(back_plane.program.uniforms.uRippleWaveFactor, {
      value: 0.5,
      duration: timeline_config.back_plane_ripple_wave_factor_duration,
      ease: timeline_config.back_plane_ripple_wave_factor_ease
    }, timeline_config.back_plane_ripple_wave_factor_timeline)

  }


  return tl
}

