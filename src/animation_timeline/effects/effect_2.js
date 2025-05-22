import default_config from "./effect_0";
import gsap from "gsap"
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

export default {
  ...default_config
}
