import React from "react";
import fs from "fs";
import World from "../../libs/World";
import MorphologyBuilder from "./morphologybuilder";
import Morphology from "./morphology";
import Utf8ArrayToStr from "../../libs/decoding";

const morphoData = Utf8ArrayToStr(fs.readFileSync(__dirname + "/raw.txt"));

class MorphologyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.viewContainer = React.createRef();

    this.viewContainer = null;

    this.setViewContainer = element => {
      this.viewContainer = element;
      this.makeVisualizer();
    };
  }
  makeVisualizer() {
    if (this.viewContainer) {
      this.world = new World(this.viewContainer);
      this.world.animate();
      // this.morphology = new Morphology();
      // this.world.scene.webgl.add(this.morphology);
      // tshis.morphology.load(morphoData);
      MorphologyBuilder.displayOnScene(
        this.world.scene.webgl,
        morphoData,
        () => { },
        () => { }
       );
    }
  }
  componentWillUnmount () {
    this.world.destroy();
  }
  render () {
    return (
      <div id="mophology-viewer" className="morpho-viz full-height" ref={this.setViewContainer}>
      </div>
    );
  }
}


export default MorphologyContainer;