import React from "react";
import World from "../../libs/World";
import MorphologyBuilder from "./morphologybuilder";
import SVG from "react-svg";
import icons from "../Icons";

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
    if (this.props.morphologySrc) {
      let response = await fetch("http://localhost:9999/data/" + this.props.morphologySrc);
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
      this.world.renderer.webgl.domElement.className += "fade";
      this.world.animate();
      MorphologyBuilder.displayOnScene(
        this.world.scene.webgl,
        morphoData,
        () => {
          this.world.renderer.webgl.domElement.className += " in";
        },
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
    let loaded = !!this.state.morphoData;
    return (
      <div id="mophology-viewer" className="morpho-viz full-height">
        {!loaded &&
          <div style={{ width: "6em", margin: "0 auto", marginTop: "10em" }}>
            <SVG
                path={icons.neuron}
                svgClassName="neuron-svg"
                className="neuron-icon loading"
              />
          </div>
        }
        {loaded &&
          <div className="full-height" ref={this.setViewContainer}></div>
        }
      </div>
    );
  }
}


export default MorphologyContainer;