import React from "react";
import fs from "fs";
import MophologyViewer from "./morphologyviewer";
import MorphologyBuilder from "./morphologybuilder";
const morphoData = fs.readFileSync(__dirname + "/raw.txt");
console.log('morpho data', morphoData)

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
      this.viewer = new MophologyViewer(this.viewContainer);
      this.viewer.onShow();
      MorphologyBuilder.displayOnScene(this.viewer.scene,
        morphoData,
        this.viewer.initialSetup.bind(this.viewer),
        this.viewer.updateBoundingBox.bind(this.viewer)
       );
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