export default function getDebugProperties(gui, guiObj, back_plane, front_plane, index) {


  gui.add(guiObj, "blur").min(0.01).max(0.1).step(0.01).onFinishChange((v) => {
    back_plane.program.uniforms.uBlurAmount.value = v
  })
  gui.add(guiObj, "uBorderRadius").min(0.01).max(0.5).step(0.01).onFinishChange((v) => {
    back_plane.program.uniforms.uBorderRadius.value = v
  })

  if (index == 0 || index == 2) {
    guiObj = {
      ...guiObj,
      uDistortionIntensity: 0.02,
      uGlowIntensity: 1.,

    }

    gui.add(guiObj, "uGlowIntensity").min(0.1).max(2).step(0.01).onFinishChange((v) => {
      back_plane.program.uniforms.uGlowIntensity.value = v
    })
    gui.add(guiObj, "uDistortionIntensity").min(0.01).max(0.08).step(0.001).onFinishChange((v) => {
      back_plane.program.uniforms.uDistortionIntensity.value = v
    })
  }
  if (index == 3) {
    guiObj = {
      ...guiObj,
      uDistortionIntensity: 0.05,
      uGlowIntensity: 1.5
    }

    gui.add(guiObj, "uGlowIntensity").min(0.1).max(2).step(0.01).onFinishChange((v) => {
      back_plane.program.uniforms.uGlowIntensity.value = v
    })
    gui.add(guiObj, "uDistortionIntensity").min(0.01).max(0.08).step(0.001).onFinishChange((v) => {
      back_plane.program.uniforms.uDistortionIntensity.value = v
    })
  }
  if (index == 1 || index == 4) {
    guiObj = {
      ...guiObj,
      uDistortionIntensity: 0.01,
      uGlowIntensity: 0.7
    }

    gui.add(guiObj, "uGlowIntensity").min(0.1).max(2).step(0.01).onFinishChange((v) => {
      back_plane.program.uniforms.uGlowIntensity.value = v
    })
    gui.add(guiObj, "uDistortionIntensity").min(0.01).max(0.08).step(0.001).onFinishChange((v) => {
      back_plane.program.uniforms.uDistortionIntensity.value = v
    })
  }

  return guiObj
}
