import React from "react";
import fs from "fs";
import World from "../../libs/World";
import MorphologyBuilder from "./morphologybuilder";
import Morphology from "./morphology";
import Utf8ArrayToStr from "../../libs/decoding";
import { has } from "underscore";

// const morphoData = Utf8ArrayToStr(fs.readFileSync(__dirname + "/test.txt"));

class MorphologyContainer extends React.Component {
  state = { morphoData: null }
  constructor(props) {
    super(props);
    this.viewContainer = React.createRef();

    this.viewContainer = null;

    this.setViewContainer = element => {
      this.viewContainer = element;
    };
  }
  async componentDidMount () {
    if (this.props.morphology && this.props.morphology.distribution && this.props.morphology.distribution.fileName) {
      let response = await fetch("http://localhost:9999/data/" + this.props.morphology.distribution.fileName + ".text");
      let morphoData = await response.text();
      this.setState({ morphoData });
    }
  }
  componentDidUpdate () {
    if (!this.world) {
      this.makeVisualizer();
    }
  }
  makeVisualizer() {
    let { morphoData } = this.state;
    if (this.viewContainer && morphoData) {
      this.world = new World(this.viewContainer);
      this.world.animate();
      MorphologyBuilder.displayOnScene(
        this.world.scene.webgl,
        morphoData,
        () => { },
        () => { }
       );
    }
  }
  componentWillUnmount () {
    if (this.world) {
      this.world.destroy();
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