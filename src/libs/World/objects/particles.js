import {randomInt, randomFloat} from '../helpers/random'
import * as THREE from 'three'

/**
 * Object Cloud class
 */
class ObjectCloud extends THREE.Object3D {

  /**
   * Constructor function
   */
  constructor () {
    super()

    const colors = [
      new THREE.Color(0xF6D169),
      new THREE.Color(0xE6A972),
      new THREE.Color(0xDEE2EA),
      new THREE.Color(0xDEE2EA),
      new THREE.Color(0xDEE2EA),
      new THREE.Color(0xB66E6F)
    ]

    this.size = 75
    this.geometry = [
      new THREE.BoxBufferGeometry(this.size, this.size, this.size),
      new THREE.ConeBufferGeometry(this.size - 10, this.size, 2, 0)
    ]

    for (var i = 0; i < 70; i++) {
      // Create Main Object
      let color = colors[randomInt(0, colors.length - 1)]
      let geometry = this.geometry[randomInt(0, this.geometry.length - 1)]
      let material = new THREE.LineBasicMaterial({color: color})
      let mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material)

      // Generate random position, rotation and scale
      let position = new THREE.Vector3(randomInt(-1200, 1200), randomInt(-2500, 2500), randomInt(-1000, 300))
      let rotation = new THREE.Vector3(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI)
      let randomScale = randomFloat(0.05, 0.5)

      // Set it
      mesh.position.set(position.x, position.y, position.z)
      mesh.rotation.set(rotation.x, rotation.y, rotation.z)
      mesh.scale.set(randomScale, randomScale, randomScale)
      this.add(mesh)
      /*
      // Create Fill Object
      let fill = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xFFFFFF}))
      fill.position.set(position.x, position.y, position.z)
      fill.rotation.set(rotation.x, rotation.y, rotation.z)
      fill.scale.set(randomScale, randomScale, randomScale)
      this.add(fill)
      */
    }
  }

  /**
   * Update function
   * @param {number} time Time
   */
  update (time) {
    this.rotation.y += 0.0008
    this.rotation.x += 0.0008
  }
}

export default ObjectCloud