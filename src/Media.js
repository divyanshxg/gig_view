import { Mesh, Plane, Program, Texture, Vec2 } from "ogl";
import vertex from './shaders/vertex.glsl';
import { CustomEase } from 'gsap/CustomEase'


import gsap from "gsap";
gsap.registerPlugin(CustomEase)

export default class Media {
  constructor({ renderer, scene, geometry, img, gl, back_fragment, front_fragment, gui, elemIndex }) {

    this.gui = gui


    this.guiObj = {
    }
    if (this.gui._title == `effect_0` || this.gui._title == "effect_2") {
      this.guiObj = {
        ...this.guiObj,
        uDistortionIntensity: 0.02,
        uGlowIntensity: 0.7

      }

      gui.add(this.guiObj, "uGlowIntensity").min(0.1).max(2).step(0.01).onFinishChange((v) => {
        this.back_plane.program.uniforms.uGlowIntensity.value = v
      })
      gui.add(this.guiObj, "uDistortionIntensity").min(0.01).max(0.08).step(0.001).onFinishChange((v) => {
        this.back_plane.program.uniforms.uDistortionIntensity.value = v
      })
    }
    if (this.gui._title == `effect_3`) {
      this.guiObj = {
        ...this.guiObj,
        uDistortionIntensity: 0.05,
        uGlowIntensity: 1.5
      }

      gui.add(this.guiObj, "uGlowIntensity").min(0.1).max(2).step(0.01).onFinishChange((v) => {
        this.back_plane.program.uniforms.uGlowIntensity.value = v
      })
      gui.add(this.guiObj, "uDistortionIntensity").min(0.01).max(0.08).step(0.001).onFinishChange((v) => {
        this.back_plane.program.uniforms.uDistortionIntensity.value = v
      })
    }
    if (this.gui._title == `effect_1`) {
      this.guiObj = {
        ...this.guiObj,
        uDistortionIntensity: 0.02,
        uGlowIntensity: 0.7

      }

      gui.add(this.guiObj, "uGlowIntensity").min(0.1).max(2).step(0.01).onFinishChange((v) => {
        this.back_plane.program.uniforms.uGlowIntensity.value = v
      })
      gui.add(this.guiObj, "uDistortionIntensity").min(0.01).max(0.08).step(0.001).onFinishChange((v) => {
        this.back_plane.program.uniforms.uDistortionIntensity.value = v
      })
    }
    this.renderer = renderer;
    this.scene = scene;
    this.img = img;
    this.geometry = geometry;
    this.gl = gl;
    this.image_dimensions = new Vec2(0, 0); // Initialize image dimensions
    this.back_plane = this.createMesh(back_fragment)
    this.back_plane.position.z -= 0.1
    this.front_plane = this.createMesh(front_fragment);
    this.createTimeline()

  }

  createMesh(fragment) {
    let div = 1.5;
    const mesh_scale = new Vec2(9 / div, 19.5 / div);

    const texture = new Texture(this.gl, {
      minFilter: this.gl.LINEAR_MIPMAP_LINEAR,
      magFilter: this.gl.LINEAR,
      generateMipmaps: true,
      wrapS: this.gl.MIRRORED_REPEAT,
      wrapT: this.gl.MIRRORED_REPEAT,
    });

    const image = new Image();
    image.onload = () => {
      texture.image = image;
      this.image_dimensions.set(image.naturalWidth, image.naturalHeight);
      if (this.front_plane && this.front_plane.program) {
        this.front_plane.program.uniforms.uImage.value = this.image_dimensions;
      }
    };
    image.src = this.img;

    const program = new Program(this.gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        uTime: {
          value: 0,
        },
        uProgress: {
          value: 0.0001,
        },
        uTexture: {
          value: texture
        },
        uImage: {
          value: this.image_dimensions, // Pass the *instance*
        },
        uPlane: {
          value: mesh_scale
        },
        uResolution: {
          value: new Vec2(window.innerWidth, window.innerHeight)
        },
        unblur_p: {
          value: 0
        },
        wave_progress_1: {
          value: 0
        },
        wave_progress_2: {
          value: 0
        },
        uGlowIntensity: {
          value: this.guiObj.uGlowIntensity
        },
        uDistortionIntensity: {
          value: this.guiObj.uDistortionIntensity
        },
        uTextureStretch: {
          value: 0
        }


      }
    });

    const mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: program
    });

    // mesh.position.z -= 1.
    // mesh.scale.set(mesh_scale.x, mesh_scale.y, 1); // Use the local variable
    mesh.setParent(this.scene);

    return mesh; // Very important to return the mesh!
  }

  createTimeline() {

    // Default timeline configuration
    this.timeline_config = {
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
    };

    if (this.gui._title === "effect_1") {
      let ease = CustomEase.create("custom", "M0,0 C0.272,0 0.657,0.231 0.681,0.272 0.759,0.406 0.744,0.947 1,0.947 ");
      this.timeline_config = {
        ...this.timeline_config,
        glow_ease: ease,
        glow_delay: 0,
        distortion_delay: 0.45,
        back_wave_progress_1_ease: ease,
        back_wave_progress_1_timeline: "start+=0",
      };
    }

    if (this.gui._title === "effect_3") {
      let stretch_ease = CustomEase.create("custom", "M0,0 C0.048,0 0.195,0.086 0.29,0.272 0.432,0.551 0.579,0.969 0.73,0.969 0.817,0.969 0.861,0 0.921,-0.285 0.954,-0.439 0.977,0 1,0 ");
      let ease = CustomEase.create("custom", "M0,0 C0.069,0.21 0.274,0.039 0.507,0.25 0.592,0.327 0.582,0.612 0.644,0.753 0.67,0.813 0.7,0.874 0.751,0.911 0.845,0.981 0.97,1 1,1 ")
      this.timeline_config = {
        ...this.timeline_config,
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
    }

    this.tl = gsap.timeline();
    this.tl.to(this.front_plane.scale, {
      x: 0.5,
      y: 0.5,
      duration: this.timeline_config.front_scale_first_duration,
      ease: this.timeline_config.front_scale_first_ease
    }, this.timeline_config.front_scale_first_timeline);
    this.tl.to(this.front_plane.scale, {
      y: 0.38,
      x: 0.42,
      duration: this.timeline_config.front_scale_second_duration,
      ease: this.timeline_config.front_scale_second_ease
    }, this.timeline_config.front_scale_second_timeline);
    this.tl.to(this.front_plane.program.uniforms.uProgress, {
      value: 1,
      duration: this.timeline_config.front_progress_duration,
      ease: this.timeline_config.front_progress_ease
    }, this.timeline_config.front_progress_timeline);
    this.tl.to(this.front_plane.position, {
      y: 1.0,
      duration: this.timeline_config.front_position_y_duration,
      ease: this.timeline_config.front_position_y_ease
    }, this.timeline_config.front_position_y_timeline);
    this.tl.to(this.back_plane.program.uniforms.unblur_p, {
      value: 1,
      duration: this.timeline_config.back_unblur_duration,
      ease: this.timeline_config.back_unblur_ease
    }, this.timeline_config.back_unblur_timeline);
    this.tl.to(this.back_plane.program.uniforms.wave_progress_1, {
      value: 3.0,
      ease: this.timeline_config.back_wave_progress_1_ease,
      duration: this.timeline_config.back_wave_progress_1_duration
    }, this.timeline_config.back_wave_progress_1_timeline);
    this.tl.to(this.back_plane.program.uniforms.wave_progress_2, {
      value: 3.0,
      ease: this.timeline_config.back_wave_progress_2_ease,
      duration: this.timeline_config.back_wave_progress_2_duration
    }, this.timeline_config.back_wave_progress_2_timeline);


    if (this.gui._title === "effect_3") {
      this.tl.to(this.back_plane.program.uniforms.uTextureStretch, {
        value: 1.,
        duration: this.timeline_config.back_wave_stretch_duration,
        ease: this.timeline_config.back_wave_progress_stretch_ease
      }, this.timeline_config.back_wave_stretch_timeline)

    }

    this.tl.paused()

  }

  onClick() {

    let temp = {
      value: 0
    }
    this.tl.restart()

  }

  update() {

  }
}
