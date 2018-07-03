import React from "react";
import fs from "fs";
import World from "../../libs/World";
import MophologyViewer from "./morphologyviewer";
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
      this.morphology = new Morphology();
      this.world.scene.webgl.add(this.morphology);
      this.morphology.load(morphoData);
      // this.viewer = new MophologyViewer(this.viewContainer);
      // this.viewer.onShow();
      // MorphologyBuilder.displayOnScene(this.viewer.scene,
      //   morphoData,
      //   this.viewer.initialSetup.bind(this.viewer),
      //   this.viewer.updateBoundingBox.bind(this.viewer)
      //  );
    }
  }
  render () {
    return (
      <div id="mophology-viewer" className="morpho-viz full-height" ref={this.setViewContainer}>
      </div>
    );
  }
}


export default MorphologyContainer;