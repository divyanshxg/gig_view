import { Mesh, Plane, Program, Texture, Vec2 } from "ogl";
import gsap from "gsap";
import { CustomEase } from 'gsap/CustomEase'
import getDebugProperties from "../utils/debug";
import animationTimeline from "../animation_timeline/createTimeline";
import notch_vs from '../shaders/notch_shader/vertexShader.glsl'
import notch_fs from '../shaders/notch_shader/fragmentShader.glsl'
import image_grid from '../../assets/grid.png'

gsap.registerPlugin(CustomEase)

export default class Media {
  static count = 0;
  constructor({ renderer, scene, geometry, img, gl, back_fragment, front_fragment, back_vertex, front_vertex, gui, elemIndex, containerAR }) {
    // count++;

    console.log(Media.count)
    Media.count++;
    this.containerAR = containerAR;
    this.gui = gui
    this.elementIndex = elemIndex;

    // GUI OBJ to vary parameters
    this.guiObj = {
      blur: 0.03,
      uBorderRadius: 0.2,
      uDistortionIntensity: 0.02,
      uGlowIntensity: 1.,
    }

    this.renderer = renderer;
    this.scene = scene;
    this.img = img;
    this.geometry = geometry;
    this.gl = gl;
    this.image_dimensions = new Vec2(0, 0); // Initialize image dimensions
    this.back_plane = this.createMesh(back_fragment, back_vertex)
    this.back_plane.position.z -= 0.001
    this.front_plane = this.createMesh(front_fragment, front_vertex);
    this.createNotch()

    // Adding DEBUG GUI
    this.guiObj = getDebugProperties(gui, this.guiObj, this.back_plane, this.front_plane, this.elementIndex)
    this.createTimeline()

  }

  createMesh(fragment_shader, vertex_shader) {

    // Compile vertex shader
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertex_shader);
    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {

      console.error(`Vertex shader ${this.elementIndex} - ${vertexShader} compilation failed:`, this.gl.getShaderInfoLog(vertexShader));
      return null;
    }

    // Compile fragment shader
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fragment_shader);
    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      console.error(`Fragment shader ${this.elementIndex} - ${fragment_shader} compilation failed:`, this.gl.getShaderInfoLog(fragmentShader));
      return null;
    }

    // creating a texture with some basic properties
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
      //setting the uniform uImage to the natural width of image (for cover uv)
      this.image_dimensions = new Vec2(image.naturalWidth, image.naturalHeight);

      if (this.front_plane && this.front_plane.program) {
        this.front_plane.program.uniforms.uImage.value = this.image_dimensions;
      }

      if (this.back_plane && this.back_plane.program) {
        this.back_plane.program.uniforms.uImage.value = this.image_dimensions;
      }

    };
    // image.src = this.img;
    image.src = image_grid;

    if (Media.count == 1) {
      image.src = this.img;
    } else {
      image.src = image_grid;
    }
    const program = new Program(this.gl, {
      vertex: vertex_shader,
      fragment: fragment_shader,
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
          value: new Vec2(this.containerAR, 1.)
          // value: new Vec2(1)
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
        // 3rd wave progress uniform is used in effect_4
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
        uGlowRadius: {
          value: 0
        },
        uRippleProgress1: {
          value: 0
        },
        uRippleProgress2: {
          value: 0
        },
        uRippleProgress3: {
          value: 0
        },
        uRippleWidth: {
          value: 0
        },
        uRippleWave: {
          value: 0
        },
        uFallOff: {
          value: 0.31
        },
        uRippleWaveFactor: {
          value: 0
        }
      }
    });

    const mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: program
    });

    mesh.setParent(this.scene);

    return mesh;
  }
  createNotch() {
    const geo = new Plane(this.gl)
    const plane_dim = new Vec2(0.13, 0.04);
    const program = new Program(this.gl, {
      vertex: notch_vs,
      fragment: notch_fs,
      uniforms: {
        uPlane: {
          value: plane_dim
        }

      }
    })
    this.notch = new Mesh(this.gl, {
      program: program,
      geometry: geo
    })
    this.notch.scale.set(plane_dim.x, plane_dim.y, 1)
    this.notch.position.z = 0.1
    this.notch.setParent(this.scene)
    this.notch.position.y += 0.423
  }

  createTimeline() {

    this.tl = animationTimeline(this.front_plane, this.back_plane, this.notch, this.elementIndex, this.guiObj)
    this.tl.pause()
    // this.tl.paused()

  }
  onResize() { }

  updateAspectRatio(newAR) {
    this.containerAR = newAR;
    if (this.front_plane && this.front_plane.program) {
      this.front_plane.program.uniforms.uPlane.value = new Vec2(this.containerAR, 1);
    }
    if (this.back_plane && this.back_plane.program) {
      this.back_plane.program.uniforms.uPlane.value = new Vec2(this.containerAR, 1);
    }
  }

  onClick() {

    this.tl.restart()

  }

  update() {
    this.back_plane.program.uniforms.uTime.value += 0.05
    // console.log(this.guiObj.uShockWaveDelay)
  }
}
