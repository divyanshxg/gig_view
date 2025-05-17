import { Mesh, Plane, Program, Texture, Vec2 } from "ogl";
import vertex from './shaders/vertex.glsl';
import fragment_back from './shaders/fragment_back.glsl';
import fragment_front from './shaders/fragment_front.glsl';

import gsap from "gsap";

export default class Media {
  constructor({ renderer, scene, geometry, img, gl }) {
    this.renderer = renderer;
    this.scene = scene;
    this.img = img;
    this.geometry = geometry;
    this.gl = gl;
    this.image_dimensions = new Vec2(0, 0); // Initialize image dimensions
    this.back_plane = this.createMesh(fragment_back)
    this.back_plane.position.z -= 0.1
    this.front_plane = this.createMesh(fragment_front);
    this.createTimeline()

    // this.front_plane.scale.x *= 1 / 2.5;
    // this.front_plane.scale.y *= 1 / 2.5;
  }

  // updateTexture(newImg) {
  //   const texture = new Texture(this.gl, {
  //     minFilter: this.gl.LINEAR,
  //     magFilter: this.gl.LINEAR
  //   });
  //
  //   const image = new Image();
  //   image.onload = () => {
  //     texture.image = image;
  //     this.image_dimensions.set(image.naturalWidth, image.naturalHeight);
  //     if (this.front_plane && this.front_plane.program) {
  //       this.front_plane.program.uniforms.uImage.value = this.image_dimensions;
  //     }
  //   };
  //   image.src = newImg;
  //
  // }
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
      ease: "power4.inOut",
      duration: 3.,
      // delay: 0.4,
    }, "start+=0.4")
    this.tl.to(this.back_plane.program.uniforms.wave_progress_2, {
      value: 3.,
      ease: "power4.inOut",
      duration: 3.,
      // delay: 0.7

    }, "start+=0.7")


    this.tl.paused()

  }

  onClick() {

    let temp = {
      value: 0
    }
    this.tl.play()
    gsap.to(temp, {
      value: 1,
      duration: 3.,
      onComplete: () => {
        console.log("hi")
        this.tl.reverse()
      }
    })


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
