const THREE = require("three");
const TrackballControls = require("three-trackballcontrols");
import Emitter from "./helpers/emitter";

/**
 * Controls class
 */
class Controls extends TrackballControls {
  /**
   *Creates an instance of Controls.
   * @param {*} camera
   * @param {*} renderer
   * @memberof Controls
   */
  constructor(camera, renderer) {
    super(camera, renderer.domElement);
    this.rotateSpeed = 2.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.8;
    Emitter.on('resize', this.handleResize.bind(this))
  }
}

export default Controls;
