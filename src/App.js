import { back_fragment, front_fragment } from "./utils/shaders.js";
import Media from "./Media"
import { Renderer, Camera, Transform, Plane } from 'ogl'

export default class App {
  constructor(container, snapshot_img, index, gui) {
    this.gui = gui
    this.elemIndex = index
    this.img = snapshot_img
    this.container = container
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.gl.canvas.style.zIndex = 3

    this.createGeometry()

    this.onResize()

    this.createMedias()

    this.update()

    this.addEventListeners()
  }

  createRenderer() {
    this.renderer = new Renderer({
      dpr: 2,
      antialias: true,
      autoClear: true,
      alpha: true

    })

    this.gl = this.renderer.gl
    this.gl.clearColor(0.79607843137, 0.79215686274, 0.74117647058, 0.0)
    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl, {
      top: 0.5,
      left: -0.5,
      right: 0.5,
      bottom: -0.5
    })
    this.camera.position.z = 20

  }

  createScene() {
    this.scene = new Transform()
  }

  updateTextures(img) {
    if (this.medias) {
      this.medias.updateTexture(img)
    }
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl)
  }

  createMedias() {
    this.medias = new Media({
      renderer: this.renderer,
      scene: this.scene,
      geometry: this.planeGeometry,
      img: this.img,
      gl: this.gl,
      back_fragment: back_fragment[this.elemIndex],
      front_fragment: front_fragment[this.elemIndex],
      gui: this.gui,
      elemIndex: this.elemIndex
    })
  }

  /**
   * Events.
   */
  onTouchDown(event) {
    if (this.medias) {
      this.medias.onClick()
    }

  }

  onTouchMove(event) {

  }

  onTouchUp(event) {

  }

  onWheel(event) {

  }

  /**
   * Resize.
   */
  onResize() {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.renderer.setSize(this.container.getBoundingClientRect().width, this.container.getBoundingClientRect().height)

  }

  /**
   * Update.
   */
  update() {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })


    if (this.medias) {
      this.medias.update()
    }

    window.requestAnimationFrame(this.update.bind(this))
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this))

    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('wheel', this.onWheel.bind(this))

    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }
}

