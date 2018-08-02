import React from "react";
import { connect } from "react-redux";
import SVG from "react-svg";
import World from "../../libs/World";
import MorphologyBuilder from "./morphologybuilder";
import icons from "../Icons";
import { makeCancelable } from "../../libs/promise";

function getStaticData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.status < 400) {
          return response.text();
        } else {
          throw new Error("failed to load morphology");
        }
      })
      .then(resolve)
      .catch(reject);
  });
}

class MorphologyContainer extends React.Component {
  state = { morphoData: null, error: null };
  constructor(props) {
    super(props);
    this.viewContainer = React.createRef();

    this.viewContainer = null;

    this.setViewContainer = element => {
      this.viewContainer = element;
    };
  }
  componentDidMount() {
    if (this.props.morphologySrc) {
      this.fetchDataPromise = makeCancelable(getStaticData(
        this.props.staticContentLocation + "/" + this.props.morphologySrc
      ));
      this.fetchDataPromise.promise
        .then(morphoData => {
          this.setState({ morphoData });
        })
        .catch(error => {
          this.setState({ error: error.message });
        });
    }
  }
  componentWillUnmount() {
    if (this.fetchDataPromise) {
      this.fetchDataPromise.cancel();
    }
    if (this.world) {
      this.world.destroy();
    }
  }
  componentDidUpdate() {
    if (!this.world) {
      this.makeVisualizer();
    } else {
      this.shouldRender();
    }
  }
  shouldRender() {
    if (!this.world) {
      return;
    }
    if (this.props.shouldRender) {
      this.world.unPause();
    } else {
      this.world.pause();
    }
  }
  makeVisualizer() {
    let { morphoData } = this.state;
    if (this.viewContainer && morphoData) {
      this.world = new World(this.viewContainer);
      this.world.renderer.webgl.domElement.className += "fade";
      this.world.animate();
      // TODO create cancellable promise to reduce memory leak
      MorphologyBuilder.displayOnScene(
        this.world.scene.webgl,
        morphoData,
        () => {
          this.world.renderer.webgl.domElement.className += " in";
          setTimeout(() => {
            this.shouldRender();
          }, 700);
        },
        () => {}
      );
    }
  }
  render() {
    let loaded = !!this.state.morphoData;
    let error = this.state.error;
    return (
      <div id="mophology-viewer" className="morpho-viz full-height">
        {!loaded &&
          !error && (
            <div style={{ width: "6em", margin: "0 auto", marginTop: "10em" }}>
              <SVG
                path={icons.neuron}
                svgClassName="neuron-svg"
                className="neuron-icon loading"
              />
            </div>
          )}
        {error && (
          <div style={{ width: "6em", margin: "0 auto", marginTop: "10em" }}>
            <SVG
              path={icons.neuron}
              svgClassName="neuron-svg"
              className="neuron-icon"
            />
          </div>
        )}
        {loaded &&
          !error && <div className="full-height" ref={this.setViewContainer} />}
      </div>
    );
  }
}

function mapStateToProps({ config }) {
  return {
    staticContentLocation: config.staticContentLocation
  };
}

export default connect(mapStateToProps)(MorphologyContainer);
