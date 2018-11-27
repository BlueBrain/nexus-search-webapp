import React, { Fragment } from "react";
import { connect } from "react-redux";
import SVG from "react-svg";
import icons from "../Icons";
import { makeCancelable } from "@libs/promise";
import fetchProtectedData from "../../libs/fetchProtectedData";
import { SwcParser } from "swcmorphologyparser";
import morphoviewer from "morphoviewer";

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
      if (morphologySrc.endsWith(".swc")) {
        this.fetchDataPromise = makeCancelable(
          fetchProtectedData.asPlainText(morphologySrc, token)
        );
        this.fetchDataPromise.promise
          .then(morphoData => {
            const swcParser = new SwcParser();
            swcParser.parse(morphoData);
            this.setState({ morphoData: swcParser.getRawMorphology() });
          })
          .catch(error => {
            console.error(error);
            this.setState({ error: error.message });
          });
      } else {
        this.fetchDataPromise = makeCancelable(
          fetchProtectedData.asJSON(morphologySrc, token)
        );
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
  }
  componentWillUnmount() {
    if (this.fetchDataPromise) {
      this.fetchDataPromise.cancel();
    }
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
  componentDidUpdate() {
    if (!this.viewer) {
      this.makeVisualizer();
    }
  }
  async makeVisualizer() {
    let { morphoData } = this.state;
    let { name, wholeBrain, token, wholeMouseBrainMeshLocation } = this.props;
    if (this.viewContainer && morphoData) {
      try {
        this.viewer = new morphoviewer.MorphoViewer(this.viewContainer);
        if (wholeBrain) {
          let wholeBrainObjData = await fetchProtectedData.asPlainText(
            wholeMouseBrainMeshLocation,
            token
          );
          if (wholeBrainObjData) {
            this.viewer.addObjToMeshCollection(wholeBrainObjData, {
              name: "brain", // the name of it?
              focusOn: true // do we want to focus on it when it's loaded?
            });
          }
        }
        this.viewer.addMorphology(morphoData, {
          focusOn: !wholeBrain, // do we want the camera to focus on this one when it's loaded?
          distance: 1200,

          asPolyline: wholeBrain || !!this.props.polyLine, // with polylines of with cylinders?
          // onDone: optionalCallback, // what to do when it's loaded?
          //color: Math.floor(Math.random() * 0xFFFFFF), // if not present, all neurones will have there axon in blue, basal dendrite in red and apical dendrite in green
          somaMode: "fromOrphanSections"
        });
      } catch (error) {
        console.error("problem with cell ", name, error);
      }
    }
  }
  render() {
    let loaded = !!this.state.morphoData;
    let error = this.state.error;
    return (
      <div id="mophology-viewer" className="morpho-viz full-height">
        {!loaded && !error && (
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
        {loaded && !error && (
          <Fragment>
            <div
              className="full-height"
              style={{ overflow: "hidden" }}
              ref={this.setViewContainer}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps({ config, auth }) {
  return {
    staticContentLocation: config.staticContentLocation,
    wholeMouseBrainMeshLocation: config.wholeMouseBrainMeshLocation,
    token: auth.token
  };
}

export default connect(mapStateToProps)(MorphologyContainer);
