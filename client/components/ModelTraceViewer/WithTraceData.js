import React, { Component } from "react";
import { connect } from "react-redux";
import { sortBy, indexBy } from "underscore";
import randomColor from "randomcolor";
import fetchProtectedData from "../../libs/fetchProtectedData";

const COLOR_SETTINGS = {
  luminosity: "light",
  // hue: "blue"
};

function processExperimentalData(data) {
  const sweepCollection = Object.keys(data.values).map(sweepKey => ({
    sweepKey,
    current: data.values[sweepKey],
    segments: data.values[sweepKey].i_segments,
    maxCurrent: data.values[sweepKey].i_segments[1].amp
  }));
  let sweeps = sortBy(sweepCollection, "maxCurrent");
  console.log({sweeps});
  let palette = randomColor({
    count: sweeps.length,
    ...COLOR_SETTINGS
  });
  sweeps = sweeps.map((sweep, index) =>
    Object.assign(sweep, { color: palette[index] })
  );

  // TODO optimize! use only a single reduce!
  const { dt, dur } = data;
  const times = Array.apply(null, { length: dur / dt }).map(
    (value, index) => index * dt
  );
  let stimulusData = [];
  let responseData = [];

  times.forEach((time, index) => {
    stimulusData.push(
      sweeps.reduce(
        (acc, sweep) => acc.concat(data.values[sweep.sweepKey].i[index]),
        [time]
      )
    );
    responseData.push(
      sweeps.reduce(
        (acc, sweep) => acc.concat(data.values[sweep.sweepKey].v[index]),
        [time]
      )
    );
  });
  return { stimulusData, responseData, sweeps };
}

function processModelData (data) {
  const { dt, dur } = data;
  const times = Array.apply(null, { length: dur / dt }).map(
    (value, index) => index * dt
  );
  let modelData = [];

  times.forEach((time, index) => {
    modelData.push([time, data.v[index]])
  });
  return modelData;
}

class WithTraceDataContainer extends Component {
  state = {
    status: "pending"
  };
  componentDidMount() {
    this.fetchTraces();
  }
  componentDidUpdate (nextProps) {
    if (
      (nextProps.selectedProtocol !== this.props.selectedProtocol) ||
      (nextProps.selectedCell !== this.props.selectedCell)
    ) {
      this.fetchTraces();
    }
  }
  async fetchTraces() {
    this.setState({
      status: "pending"
    });
    const {
      selectedProtocol,
      selectedCell,
      selectedSweep,
      traces,
      token
    } = this.props;
    const expCellIndexedList = indexBy(traces[selectedProtocol].exp, "name");
    const expTraceURL = expCellIndexedList[selectedCell].traceURL;
    const modelTraceURL = traces[selectedProtocol].model;
    let [expData, modelData] = await Promise.all([
      fetchProtectedData.asJSON(expTraceURL, token),
      fetchProtectedData.asJSON(modelTraceURL, token)
    ]);
    let { stimulusData, responseData, sweeps } = processExperimentalData(expData);
    let processedModelData = processModelData(modelData)

    this.setState({
      expData: responseData,
      modelData: processedModelData,
      currentData: stimulusData,
      sweeps,
      status: "fulfilled"
    });
  }
  componentDidCatch(error, info) {
    console.error(error);
    this.setState({ status: "error" });
  }
  render() {
    let { status, expData, modelData=null, currentData, sweeps=[] } = this.state;
    const isPending = status === "pending";
    return this.props.render({
      isPending,
      expData,
      modelData,
      currentData,
      sweeps
    });
  }
}

function mapStateToProps({ auth }) {
  return { token: auth.token };
}

export default connect(mapStateToProps)(WithTraceDataContainer);
