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
    if (this.gui._title == `effect_0`) {
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

    this.wave_config = {
      glow_delay: 0.7,
      glow_ease: "power3.inOut",
      distortion_delay: 0.8
    }
    // if (this.gui._title == `effect_0`) { }

    if (this.gui._title == `effect_1`) {
      this.wave_config = {
        glow_ease: CustomEase.create("custom", "M0,0 C0.272,0 0.657,0.231 0.681,0.272 0.759,0.406 0.744,0.947 1,0.947 "),
        // glow_ease: CustomEase.create("custom", "M0,0 C0.136,0 0.323,0.009 0.445,0.08 0.566,0.151 0.621,0.283 0.633,0.304 0.679,0.384 0.659,0.68 0.731,0.841 0.78,0.949 0.897,0.953 1,0.953 "),
        glow_delay: 0,
        distortion_delay: 0.65

      }
    }

    // const custom = CustomEase
    let x = this.front_plane.scale.x * 1 / 2.5;
    let y = this.front_plane.scale.y * 1 / 2.5;


    this.tl = gsap.timeline()
    this.tl.to(this.front_plane.scale, {
      x: 0.5,
      y: 0.5,
      duration: 1,
      ease: "power1.inOut"
    }, "start")
    this.tl.to(this.front_plane.scale, {
      y: 0.38,
      x: 0.42,
      duration: 0.3,
      ease: "none"
    }, "start+=0.9")
    this.tl.to(this.front_plane.program.uniforms.uProgress, {
      value: 1,
      duration: 1.1,
      ease: "power4.inOut",
      // delay: 0.8
    }, "start+=0.8")
    this.tl.to(this.front_plane.position, {
      y: 1.,
      duration: 1.2,
      ease: "power4.inOut",
      // delay: 0.87,
    }, "start+=0.95")
    this.tl.to(this.back_plane.program.uniforms.unblur_p, {
      value: 1,
      ease: "power1.inOut",
      duration: 0.7,
      // delay: 1.2,
    }, "start+=1.2")
    this.tl.to(this.back_plane.program.uniforms.wave_progress_1, {
      value: 3.,
      ease: this.wave_config.glow_ease,
      duration: 2.5,
      // delay: 0.4,
    }, `start+=${this.wave_config.glow_delay}`)
    this.tl.to(this.back_plane.program.uniforms.wave_progress_2, {
      value: 3.,
      ease: "power4.inOut",
      duration: 3.,
      // delay: 0.7

    }, `start+=${this.wave_config.distortion_delay}`)


    this.tl.paused()

  }

  onClick() {

    let temp = {
      value: 0
    }
    this.tl.restart()
    // gsap.to(temp, {
    //   value: 1,
    //   duration: 3.,
    //   onComplete: () => {
    //     console.log("hi")
    //     this.tl.reverse()
    //   }
    // })


    // gsap.to(this.front_plane.scale, {
    //   x: 0.5,
    //   y: 0.5,
    //   duration: 0.8,
    //   ease: "power1.inOut"
    // })
    // gsap.to(this.front_plane.position, {
    //   y: -0.05,
    //   duration: 0.8,
    //   ease: "power4.inOut",
    //   delay: 0.3
    // })
    // gsap.to(this.front_plane.scale, {
    //   y: 0.6,
    //   duration: 0.3,
    //   delay: 0.6,
    //   ease: "power1.inOut"
    // })
    // gsap.to(this.front_plane.program.uniforms.uProgress, {
    //   value: 1,
    //   duration: 0.8,
    //   ease: "power4.inOut",
    //   delay: 0.5
    // })
    // gsap.to(this.front_plane.position, {
    //   y: 3,
    //   duration: 0.8,
    //   ease: "power4.inOut",
    //   delay: 0.6,
    // })
    ////////////////////////////////////////////////////////////////////
    // gsap.to(this.front_plane.position, {
    //   y: -1.,
    //   duration: 0.4,
    //   ease: "power1.out",
    //   delay: 0.5,
    // })
    // gsap.to(this.front_plane.scale, {
    //   y: y - 1.,
    //   duration: 0.8,
    //   ease: "power1.out",
    //   delay: 0.7,
    // })
    //

  }

  update() {

  }
}
