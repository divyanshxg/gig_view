import { Mesh, Plane, Program, Texture, Vec2 } from "ogl";
import gsap from "gsap";
import { CustomEase } from 'gsap/CustomEase'
import animationTimeline from "../animation_timeline/create_timeline";
import createNotch from "./Meshes/notch";
import createFrontPlane from "./Meshes/front_plane";
import createBackPlane from "./Meshes/back_plane";

gsap.registerPlugin(CustomEase)

export default class Media {
  constructor({ renderer, scene, geometry, img, gl, gui, elemIndex, containerAR, renderElement }) {

    this.renderElement = renderElement;
    this.containerAR = containerAR;
    this.gui = gui
    this.elementIndex = elemIndex;
    this.renderer = renderer;
    this.scene = scene;
    this.img = img;
    this.geometry = geometry;
    this.gl = gl;
    this.image_dimensions = new Vec2(0, 0);
    this.createMeshes()
  }

  createMeshes() {

    // creating a texture with some basic properties
    const texture = new Texture(this.gl, {
      minFilter: this.gl.LINEAR_MIPMAP_LINEAR,
      magFilter: this.gl.LINEAR,
      generateMipmaps: true,
      wrapS: this.gl.CLAMP,
      wrapT: this.gl.CLAMP,
    });

    const image = new Image();
    image.onload = () => {
      texture.image = image;

      // getting natural width for object cover to implement object cover behaviour
      this.image_dimensions = new Vec2(image.naturalWidth, image.naturalHeight);


      // Creating Front Plane , Back Plane and Notch
      this.front_plane = createFrontPlane(this.gl, this.scene, this.geometry, texture, this.image_dimensions, this.containerAR)

      this.back_plane = createBackPlane(this.gl, this.scene, this.geometry, texture, this.image_dimensions, this.containerAR)

      this.notch = createNotch(this.gl, this.scene)


      // Updating the natural Width of image in the uniforms of front and back plane
      if (this.front_plane && this.front_plane.program) {
        this.front_plane.program.uniforms.uImage.value = this.image_dimensions;
      }

      if (this.back_plane && this.back_plane.program) {
        this.back_plane.program.uniforms.uImage.value = this.image_dimensions;
      }

      // placing the back plane at last , on top of which is front plane and then notch
      this.back_plane.position.z -= 0.001

      this.notch.position.z = 0.001
      // animation timeline
      this.tl = animationTimeline(this.front_plane, this.back_plane, this.notch, this.elementIndex, this.guiObj)
      // pausing it so doesn't run on load
      this.tl.pause()

    };
    image.src = this.img;

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

  // start/restart animation
  onClick() {
    this.tl.restart();
  }

  update() {
  }
}
