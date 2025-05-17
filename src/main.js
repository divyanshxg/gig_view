import "./style.css"
import { Renderer, Camera, Transform, Plane } from 'ogl'

import html2canvas from "html2canvas-pro";
// import Image from '../assets/image.jpg'
import Image1 from '../assets/2.jpg'
import Image2 from '../assets/3.jpg'
import Image3 from '../assets/4.jpg'
import Image4 from '../assets/5.jpg'
import Media from "./Media"
export default class App {
  constructor(container, snapshot_img) {
    this.img = snapshot_img
    this.container = container
    this.createRenderer()
    this.createCamera()
    this.createScene()

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
      alpha: true
    })

    this.gl = this.renderer.gl
    this.gl.clearColor(0.79607843137, 0.79215686274, 0.74117647058, 1)

    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl, {
      top: 0.5,
      left: -0.5,
      right: 0.5,
      bottom: -0.5
    })
    // this.camera.fov = 45
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
    })
  }

  /**
   * Events.
   */
  onTouchDown(event) {
    this.gl.canvas.style.zIndex = 3
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

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }
}



html2canvas(document.querySelector(".card"), {
  scale: 5,
  useCORS: true,
  logging: false,
  imageTimeout: 30000,
  backgroundColor: null,
  ignoreElements: (element) => {
    return element.classList.contains('do-not-capture');
  },
  onclone: (clonedDoc) => {
    const timestamp = clonedDoc.getElementById('timestamp');
    if (timestamp) {
      timestamp.textContent = new Date().toLocaleString();
    }
  }
}).then(canvas => {
  // 1. Get the data URL from the canvas:
  const imageDataURL = canvas.toDataURL('image/jpeg');

  // 2. Create a new <img> element:
  const imgElement = new Image();

  // 3. Set the src of the <img> element to the data URL:
  imgElement.src = imageDataURL;

  imgElement.onload = () => {


    const app = new App(document.querySelector(".canvas_container"), imgElement.src)

  }



}).catch(error => {
  console.error("Error capturing the card:", error);
});


