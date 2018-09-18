import React from "react";
import { connect } from "react-redux";
import Chart from "./Chart";
import Legend from "./Legend";
import { Spin } from "antd";
import { sortBy } from "underscore";

//TODO better assigned colors it seems that distinct-colors breaks on this build
function generateRandomPastelColor () {
  const cssHSL = "hsl(" + 360 * Math.random() + ',' +
  (0 + 70 * Math.random()) + '%,' +
  (85 + 10 * Math.random()) + '%)';
  return cssHSL
}

class TraceViewerContainer extends React.Component {
  state = {
    sweeps: [],
    status: "pending",
    selectedSweep: null
  };
  componentDidMount() {
    this.fetchTraces();
  }
  async fetchTraces() {
    let response = await fetch(this.props.traceURL);
    let traceData = await response.json();
    if (traceData.values) {
      const sweepCollection = Object.keys(traceData.values).map(
        sweepKey => ({
          sweepKey,
          current: traceData.values[sweepKey],
          segments: traceData.values[sweepKey].i_segments
        })
      );
      let sweeps = sortBy(
        sweepCollection,
        sweep => sweep.current[0]
      );
      sweeps = sweeps.map(sweep => Object.assign(sweep, { color: generateRandomPastelColor() }));
      console.log(sweeps);
      this.setState({ sweeps, status: "fulfilled" });
    }
  }
  componentDidCatch(error, info) {
    console.error(error);
    this.setState({ status: "error" });
  }
  handleSelectSweep (sweepKey) {
    this.setState({ selectedSweep: sweepKey });
  }
  handleSelectProtocol (protocol) {
    console.log(protocol);
  }
  render() {
    const { status, sweeps, selectedSweep } = this.state;
    const isPending = status === "pending";
    const handleSelectSweep = this.handleSelectSweep.bind(this);
    const handleSelectProtocol = this.handleSelectProtocol.bind(this);
    return (
      <Spin spinning={isPending}>
        <div className="trace-viewer">
          {!!sweeps.length && function () {
              return (
                <div>
                  <Legend sweeps={sweeps} onSelectSweep={handleSelectSweep} onSelectProtocol={handleSelectProtocol} selectedSweep={selectedSweep} />
                  <Chart label="Cell Response" />
                  <Chart label="Stimulus" />
                </div>
              );
            }()}
        </div>
      </Spin>
    );
  }
}

function mapStateToProps({ config }) {
  return {
    traceURL: config.staticContentLocation + "/trace"
  };
}

export default connect(mapStateToProps)(TraceViewerContainer);
