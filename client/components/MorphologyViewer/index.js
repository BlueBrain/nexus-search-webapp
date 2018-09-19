import React, { Fragment } from "react";
import { connect } from "react-redux";
import SVG from "react-svg";
import icons from "../Icons";
import { makeCancelable } from "@libs/promise";
import fetchProtectedData from "../../libs/fetchProtectedData";
const morphoviewer = require("morphoviewer");

class MorphologyContainer extends React.Component {
  state = { morphoData: null, error: null };
  constructor(props) {
    super(props);

    this.setViewContainer = element => {
      this.viewContainer = element;
    };
  }
  componentDidMount() {
    const { morphologySrc, token } = this.props;
    if (morphologySrc) {
      this.fetchDataPromise = makeCancelable(fetchProtectedData.asJSON(morphologySrc, token));
      this.fetchDataPromise.promise
        .then(morphoData => {
          this.setState({ morphoData });
        })
        .catch(error => {
          console.error(error);
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
    if (!this.viewer) {
      this.makeVisualizer();
    } else {
      this.shouldRender();
    }
  }
  shouldRender() {
    // toggle rendering
  }
  makeVisualizer() {
    let { morphoData } = this.state;
    if (this.viewContainer && morphoData) {
      this.viewer = new morphoviewer.MorphoViewer(this.viewContainer)
      this.viewer.addMorphology (
        morphoData,
        {
          focusOn: true, // do we want the camera to focus on this one when it's loaded?
          asPolyline: false, // with polylines of with cylinders?
          // onDone: optionalCallback, // what to do when it's loaded?
          //color: Math.floor(Math.random() * 0xFFFFFF), // if not present, all neurones will have there axon in blue, basal dendrite in red and apical dendrite in green
          somaMode: "fromOrphanSections",
        }
      )
    }
  }
  render() {
    let loaded = !!this.state.morphoData;
    let error = this.state.error;
    let image;
    if (loaded && this.world) {
      image = new Image();
      image.id = "pic";
      image.src = this.world.renderer.webgl.domElement.toDataURL();
    }
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
          !error && (
            <Fragment>
              <div className="full-height" ref={this.setViewContainer} />
            </Fragment>
          )}
      </div>
    );
  }
}

function mapStateToProps({ config, auth }) {
  return {
    token: auth.token
  };
}

export default connect(mapStateToProps)(MorphologyContainer);
