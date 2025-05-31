import gsap from 'gsap'
import getConfig from './timeline_config';

export default function animationTimeline(front_plane, back_plane, notch, index, guiConfig, my_ease) {

  let tl = gsap.timeline()

  let timeline_config = getConfig(my_ease)


  // Scaling the front plane down
  tl.to(front_plane.scale, {
    x: 0.4,
    y: 0.4,
    duration: timeline_config.front_scale_first_duration,
    ease: timeline_config.front_scale_first_ease
  }, timeline_config.front_scale_first_timeline);

  //Creating a little Bounce effect for plane
  // a little up
  tl.to(front_plane.position, {
    y: 0.015,
    duration: timeline_config.front_position_one_duration,
    ease: timeline_config.front_position_one_ease
  }, timeline_config.front_position_one_timeline);

  // going a little down
  tl.to(front_plane.position, {
    y: 0.00,
    duration: timeline_config.front_position_two_duration,
    ease: timeline_config.front_position_two_ease
  }, timeline_config.front_position_two_timeline);

  // Texture Stretching of the front plane
  tl.to(front_plane.program.uniforms.uProgress, {
    value: 2.,
    duration: timeline_config.front_progress_duration,
    ease: timeline_config.front_progress_ease
  }, timeline_config.front_progress_timeline);

  // scaling down a little more
  tl.to(front_plane.scale, {
    y: 0.37,
    x: 0.35,
    duration: timeline_config.front_scale_second_duration,
    ease: timeline_config.front_scale_second_ease
  }, timeline_config.front_scale_second_timeline);

  // going all the way up
  tl.to(front_plane.position, {
    y: 1,
    duration: timeline_config.front_position_three_duration,
    ease: timeline_config.front_position_three_ease
  }, timeline_config.front_position_three_timeline);


  // Glow Accumulation Timeline
  tl.to(back_plane.program.uniforms.uGlowWave, {
    value: 1,
    ease: timeline_config.back_glow_wave_ease,
    duration: timeline_config.back_glow_wave_duration
  }, timeline_config.back_glow_wave_timeline);


  // GlowRadius of first Plane
  tl.to(back_plane.program.uniforms.uGlowRadius, {
    value: 1,
    ease: timeline_config.glow_radius_ease,
    duration: timeline_config.glow_radius_duration
  }, timeline_config.glow_radius_timeline);

  // Unblur Timeline
  tl.to(back_plane.program.uniforms.unblur_p, {
    value: 1,
    duration: timeline_config.back_unblur_duration,
    ease: timeline_config.back_unblur_ease
  }, timeline_config.back_unblur_timeline);

  // background plane texture stretch
  tl.to(back_plane.program.uniforms.uTextureStretch, {
    value: 1.,
    duration: timeline_config.back_wave_stretch_duration,
    ease: timeline_config.back_wave_progress_stretch_ease
  }, timeline_config.back_wave_stretch_timeline)

  // Shock Wave
  tl.to(back_plane.program.uniforms.uRippleWave, {
    value: 1.0,
    duration: timeline_config.back_plane_ripple_wave_duration,
    ease: timeline_config.back_plane_ripple_wave_ease
  }, timeline_config.back_plane_ripple_wave_timeline)

  // Notch Timeline
  tl.to(notch.scale, {
    x: 0.19,
    y: 0.055,
    ease: timeline_config.notch_scale_ease,
    duration: timeline_config.notch_scale_duration
  }, timeline_config.notch_scale_timeline)



  return tl
}

