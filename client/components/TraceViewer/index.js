import React from "react";
import { connect } from "react-redux";
import Chart from "./Chart";
import Legend from "./Legend";
import { Spin } from "antd";
import { sortBy } from "underscore";

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//TODO better assigned colors it seems that distinct-colors breaks on this build
function generateRandomPastelColor () {
  let hue = getRandomArbitrary(0, 360);
  let saturation = getRandomArbitrary(50, 100);
  let light = getRandomArbitrary(20, 80);
  const cssHSL = `
    hsl(
      ${hue},
      ${saturation}%,
      ${light}%)
    `;
  return cssHSL
}

class TraceViewerContainer extends React.Component {
  state = {
    sweeps: [],
    status: "pending",
    selectedSweep: null,
    stimulusData: [],
    responseData: []
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

      // TODO optimize! use only a single reduce!
      const { dt, dur } = traceData;
      const times = Array.apply(null, {length: dur / dt }).map((value, index) => index * dt);
      let stimulusData = [];
      let responseData = [];

      times.forEach((time, index) => {
        stimulusData.push(sweeps.reduce((acc, sweep) => acc.concat(traceData.values[sweep.sweepKey].i[index]), [time]));
        responseData.push(sweeps.reduce((acc, sweep) => acc.concat(traceData.values[sweep.sweepKey].v[index]), [time]));
      });

      console.log({ traceData, sweeps, stimulusData, responseData });
      this.setState({ sweeps, stimulusData, responseData, status: "fulfilled" });
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
    const { status, sweeps, selectedSweep, stimulusData, responseData } = this.state;
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
                  <Chart label="Cell Response" yLabel={"voltage [mV]"} data={responseData} selectedSweep={selectedSweep} sweeps={sweeps}/>
                  <Chart label="Stimulus" yLabel={"current [pA]"} data={stimulusData} selectedSweep={selectedSweep} sweeps={sweeps}/>
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
