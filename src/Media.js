import { Mesh, Plane, Program, Texture, Vec2 } from "ogl";
import vertex from './shaders/vertex.glsl';
import gsap from "gsap";
import { CustomEase } from 'gsap/CustomEase'
import getDebugProperties from "./utils/debug";
import animationTimeline from "./animation_timeline/createTimeline";
gsap.registerPlugin(CustomEase)

export default class Media {
  constructor({ renderer, scene, geometry, img, gl, back_fragment, front_fragment, gui, elemIndex }) {

    this.gui = gui
    this.elementIndex = elemIndex;

    this.guiObj = {
      blur: 0.03,
      uBorderRadius: 0.15,
      uDistortionIntensity: 0.02,
      uGlowIntensity: 1.,
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
    this.guiObj = getDebugProperties(gui, this.guiObj, this.back_plane, this.front_plane, this.elementIndex)
    this.createTimeline()

  }

  createMesh(fragment) {

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
          value: new Vec2(9, 19.5)
        },
        uBorderRadius: {
          value: this.guiObj.uBorderRadius
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
        wave_progress_3: {
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
        },
        uBlurAmount: {
          value: this.guiObj.blur // 0.01- 0.03
        },
      }
    });

    const mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: program
    });

    mesh.setParent(this.scene);

    return mesh; // Very important to return the mesh!
  }

  createTimeline() {

    this.tl = animationTimeline(this.front_plane, this.back_plane, this.elementIndex)
    this.tl.paused()

  }
  onResize() { }

  onClick() {

    this.tl.restart()

  }

  update() {

  }
}
