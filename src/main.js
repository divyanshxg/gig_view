import "./style.css"
import html2canvas from "html2canvas-pro";
import GUI from "lil-gui";
import gsap from 'gsap'
import Scene from "./Experience/Scene";
import { Pane } from "tweakpane";
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';


const gui = new GUI({
  closeFolders: true
})

const effects_name = [
  "initial attemp",
  "burst transition",
  "progressive blur",
  "2nd attempt of burst",
  "polishing timeline",
  "ripple 0",
  "ripple 1",
  "ripple 2",
  "ripple 3",
  "ripple 0 - midway",
  "ripple 1 - midway",
  "ripple 2 - midway",
  "ripple 3 - midway",
  "ripple 2 - midway_end_distortion",
  "ripple 3 - chromatic",
]

const pane = new Pane({
})
pane.registerPlugin(EssentialsPlugin);

let first = true

function run() {
  let v;

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
      const imageDataURL = canvas.toDataURL('image/jpeg');

      const imgElement = new Image();

      // console.log(container[i].dataset.container)

      imgElement.src = imageDataURL;

      imgElement.onload = () => {

        const effect = gui.addFolder(`${container[i].dataset.container} - ` + effects_name[container[i].dataset.container])

        const curr_pane = `${container[i].dataset.container} - ` + effects_name[container[i].dataset.container]

        let pane_folder;


        const scene = new Scene(container[i].querySelector(".canvas_container"), imgElement.src, container[i].dataset.container, effect, pane_folder, i, v)
        const reset_btn = container[i].querySelector(".reset_anim_btn")
        reset_btn.addEventListener("click", (e) => {
          scene.onTouchDown()
        })
        container[i].querySelector(".card").remove()

      }
    }).catch(error => {
      console.error("Error capturing the card:", error);
    });
  }
}

run()
