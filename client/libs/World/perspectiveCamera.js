import * as THREE from 'three'
import TweenLite from 'gsap'
import Emitter from './helpers/emitter'

/*
 * Camera class
 */
class Camera extends THREE.PerspectiveCamera {
  /**
   * @constructor
   * @param {integer}
   * @param {integer}
   * @param {object} [options] - Camera options
   */
  constructor (width, height, options = {}) {
    const fov = options.fov || 70
    const aspect = options.aspect || width / height
    const near = options.near || 0.1
    const far = options.far || 50000

    super(fov, aspect, near, far)
    this.position.z = 300
  }

  update () {
    this.rotation.z += 0.2
  }
}

export default Camera