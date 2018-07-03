import RendererWEBGL from "./rendererWEBGL";
// import RendererCSS3D from './rendererCSS3D'
import SceneWEBGL from "./sceneWEBGL";
// import SceneCSS3D from './sceneCSS3D'
import Clock from "./clock";
import Controls from "./controls";
import Camera from "./perspectiveCamera";
import Emitter from "./helpers/emitter";

/*
 * 🌎 World class!
 */
class World {
  /**
   * Constructor function
   * @param {domElement} container - Canvas container
   * @constructor
   */
  constructor(container) {
    // HTML CONTAINER
    this.container = container;
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    // CLOCK ⏰
    this.clock = new Clock();

    // RENDER 👨🏻‍🎨
    this.renderer = {
      webgl: new RendererWEBGL(this.container)
      // css3d: new RendererCSS3D(this.container)
    };

    // CAMERA 🎥
    this.camera = new Camera(width, height);

    // CONTROLS 🕹
    this.controls = new Controls(this.camera, this.renderer.webgl);

    // SCENE 🖼
    this.scene = {
      webgl: new SceneWEBGL(
        this.renderer.webgl,
        this.camera,
        this.clock,
        "webgl"
      )
      // css3d: new SceneCSS3D(this.renderer.css3d, this.camera, 'css3d')
    };
  }

  /**
   * Animate function
   * @return {void}
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  /**
   * Render function
   * @return {void}
   */
  render() {
    this.camera.update(this.clock.delta);
    this.controls.update(this.clock.delta);
    Object.keys(this.renderer).forEach(key => {
      this.renderer[key].render(this.scene.webgl, this.camera);
    });
    Object.keys(this.scene).forEach(key => {
      this.scene[key].render();
    });
  }

  /**
   * Resize
   * @param {integer} width  - Width
   * @param {integer} height - Height
   * @return {void}
   */
  resize(width, height) {
    Emitter.emit("resize", width, height);
  }

  /**
   * Mouse Move
   * @param {integer} x  - Position X
   * @param {integer} y - Position Y
   * @return {void}
   */
  mouseMove(x, y) {
    Emitter.emit("mousemove", x, y);
  }
}

export default World;
