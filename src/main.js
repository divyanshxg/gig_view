import "./style.css"
import html2canvas from "html2canvas-pro";
import GUI from "lil-gui";
import App from "./App";


const gui = new GUI()
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
      const imageDataURL = canvas.toDataURL('image/jpeg');

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
