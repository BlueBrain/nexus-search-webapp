import Emitter from "./helpers/emitter";
import * as THREE from "three";

/**
 * Renderer WEBGL class
 */
class RendererWEBGL extends THREE.WebGLRenderer {
  /**
   * Constructor function
   * @param {integer} width Width
   * @param {integer} height Height
   * @param {object} options Options
   * @constructor
   */
  constructor(
    container,
    options = { antialias: true, alpha: true, clearColor: 0xffeecd, opacity: 0.0 }
  ) {
    super(options);

    this.setSize(container.offsetWidth, container.offsetHeight);
    this.setPixelRatio(window.devicePixelRatio);
    this.setClearColor(options.clearColor, options.opacity);
    this.domElement.style.width = "100%";
    this.domElement.style.height = "100%";
    container.appendChild(this.domElement);

    Emitter.on("resize", this.resize.bind(this));
  }

  /**
   * Resize function
   * @param {integer} width Width
   * @param {integer} height Height
   * @return {void}
   */
  resize(width, height) {
    this.setSize(width, height);
  }
}

export default RendererWEBGL;
