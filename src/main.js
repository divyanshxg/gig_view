import "./style.css"
import { Renderer, Camera, Transform, Plane } from 'ogl'
import html2canvas from "html2canvas-pro";
import Media from "./Media"
import { back_fragment, front_fragment } from "./utils";
import GUI from "lil-gui";
import image1 from '../assets/resized/2.jpg'
import image2 from '../assets/resized/1.jpg'
import image3 from '../assets/resized/3.jpg'
import image4 from '../assets/resized/4.jpg'
import image5 from '../assets/resized/5.jpg'
import image6 from '../assets/resized/6.jpg'
export default class App {
  constructor(container, snapshot_img, index, gui) {
    this.gui = gui
    this.elemIndex = index
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

    // window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    // window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }
}


const gui = new GUI()

const gui_obj = {
  img: image1
}

// gui.add(gui_obj, "img", {
//   Image1: image1,
//   Image2: image2,
//   Image3: image3,
//   Image4: image4,
//   Image5: image5,
//   Image6: image6
// }).onChange(v => {
//   console.log(v)
//   const img_elem = document.querySelectorAll(".image_container img")
//   for (let i = 0; i < img_elem.length; i++) {
//     img_elem[i].src = v
//   }
//
// })

function run() {

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


      const container = Array.from(document.querySelectorAll(".container"))
      console.log(container.length)

      const app_instances = []
      for (let i = 0; i < container.length; i++) {
        const effect = gui.addFolder(`effect_${i}`)
        const app = new App(container[i].querySelector(".canvas_container"), imgElement.src, i, effect)

        app_instances.push(app)
      }

      for (let i = 0; i < container.length; i++) {

        const reset_btn = container[i].querySelector(".reset_anim_btn")

        reset_btn.addEventListener("click", (e) => {
          app_instances[i].onTouchDown()
        })

      }


    }



  }).catch(error => {
    console.error("Error capturing the card:", error);
  });


}

run()
