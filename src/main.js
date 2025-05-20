import "./style.css"
import { Renderer, Camera, Transform, Plane } from 'ogl'
import html2canvas from "html2canvas-pro";
import Media from "./Media"
import { back_fragment, front_fragment } from "./utils";
import GUI from "lil-gui";
import image1 from '../assets/resized/2.jpg'

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
      autoClear: true,
      alpha: true

    })

    this.gl = this.renderer.gl
    this.gl.clearColor(0.79607843137, 0.79215686274, 0.74117647058, 0.0)
    //
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
const root = document.documentElement;
// Get the current value of --border-radius (optional, for initial GUI value)
// const initialBorderRadius = getComputedStyle(root).getPropertyValue('--border-radius').trim();
//
// // An object to hold the value that lil-gui will manipulate
// const settings = {
//   borderRadius: parseInt(initialBorderRadius, 10) || 0 // Default to '0px' if not defined
// };
//
// // Add a slider to control the --border-radius variable
// const borderRadiusControl = gui.add(settings, 'borderRadius')
//   .name('CSS Border Radius').min(10).max(150)
//   .onChange((newValue) => {
//     root.style.setProperty('--border-radius', `${newValue}px`);
//   });
//
// // You might want to initialize the CSS variable with the default GUI value
// console.log(settings.borderRadius)
// root.style.setProperty('--border-radius', settings.borderRadius);



function run() {


  const container = Array.from(document.querySelectorAll(".container"))
  for (let i = 0; i < container.length; i++) {
    html2canvas(container[i].querySelector(".card"), {
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

      console.log(container[i].dataset.container)

      imgElement.src = imageDataURL;

      imgElement.onload = () => {



        const effect = gui.addFolder(`effect_${container[i].dataset.container}`)
        const app = new App(container[i].querySelector(".canvas_container"), imgElement.src, container[i].dataset.container, effect)



        const reset_btn = container[i].querySelector(".reset_anim_btn")

        reset_btn.addEventListener("click", (e) => {
          app.onTouchDown()
        })



      }



    }).catch(error => {
      console.error("Error capturing the card:", error);
    });


  }

}

run()
