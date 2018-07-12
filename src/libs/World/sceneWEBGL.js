import Particles from './objects/particles'
import * as THREE from 'three'
/**
 * Scene class
 */
class Scene extends THREE.Scene {
  /**
   * Constructor function
   * @param {Renderer} Renderer - Renderer instance
   * @param {Camera}   Camera   - Camera instance
   * @param {Clock}    Clock    - Clock instance
   */
  constructor (Renderer, Camera, Clock) {
    super()

    this.renderer = Renderer
    this.camera = Camera
    this.clock = Clock
    this.createScene()
  }

  /**
   * CreateScene function
   * @return {void}
   */
  createScene () {
    // Add lights
    const ambient = new THREE.AmbientLight(0xf3928e)
    this.add(ambient)

    // this.particles = new Particles()
    // this.add(this.particles)

    const spot = new THREE.DirectionalLight(0xf3928e, 1.75) // 0xdfebff
    spot.position.set(0, -500, 500)
    spot.position.multiplyScalar(1.3)
    spot.intensity = 1
    spot.castShadow = true
    spot.shadowMapWidth = 1000
    spot.shadowMapHeight = 1000
    this.add(spot)
  }

  /**
   * Render function
   * @return {void}
   */
  render () {
    this.children.forEach(child => {
      if (child.update) { child.update() }
    })
  }
}

export default Scene