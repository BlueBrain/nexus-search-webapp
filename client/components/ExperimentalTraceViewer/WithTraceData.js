import React, { Component } from "react";
import { connect } from "react-redux";
import { sortBy, indexBy } from "underscore";
import randomColor from "randomcolor";
import fetchProtectedData from "../../libs/fetchProtectedData";

const COLOR_SETTINGS = {
  luminosity: "light"
  // hue: "blue"
};

function processExperimentalData(data) {
  return new Promise((resolve, reject) => {
    const palette = randomColor({
      count: Object.keys(data.values).length,
      ...COLOR_SETTINGS
    });

    const sweeps = Object.keys(data.values).map((sweepKey, index) => {
      return {
        sweepKey,
        color: palette[index]
      }
    }).filter(sweep => !!data.values[sweep.sweepKey].i);

    // TODO optimize! use only a single reduce!
    const { dt, dur } = data;
    const times = Array.apply(null, { length: dur / dt }).map(
      (value, index) => index * dt
    );
    let stimulusData = [];
    let responseData = [];

    times.forEach((time, index) => {
      try {
        stimulusData.push(
          sweeps.reduce(
            function (acc, sweep) {
              let sweepValue = data.values[sweep.sweepKey];
              return acc.concat(Number(sweepValue.i[index]))
            },
            [time]
          )
        );
        responseData.push(
          sweeps.reduce(
            function (acc, sweep) {
              let sweepValue = data.values[sweep.sweepKey];
              return acc.concat(Number(sweepValue.v[index]))
            },
            [time]
          )
        );
      } catch (error) {
        return reject(error);
      }
    });
    return resolve({ stimulusData, responseData, sweeps });
  });
}

class WithTraceDataContainer extends Component {
  state = {
    status: "pending",
    responseData: null,
    currentData: null,
    sweeps: []
  };
  componentDidMount() {
    this.fetchTraces();
  }
  componentDidUpdate(nextProps) {
    if (nextProps.selectedProtocol !== this.props.selectedProtocol) {
      this.fetchTraces();
    }
  }
  async fetchTraces() {
    try {
      this.setState({
        status: "pending"
      });
      const { selectedProtocol, traces, token } = this.props;
      const traceURL = traces[selectedProtocol];
      let traceData = await fetchProtectedData.asJSON(traceURL, token);
      let { stimulusData, responseData, sweeps } = await processExperimentalData(
        traceData
      );

      this.setState({
        responseData,
        currentData: stimulusData,
        sweeps,
        status: "fulfilled"
      });
    } catch(error) {
      console.error(error);
    }
  }
  componentDidCatch(error, info) {
    console.error(error);
    this.setState({ status: "error" });
  }
  render() {
    let { status, responseData, currentData, sweeps } = this.state;
    return this.props.render({
      status,
      responseData,
      currentData,
      sweeps
    });
  }
}

function mapStateToProps({ auth }) {
  return { token: auth.token };
}

export default connect(mapStateToProps)(WithTraceDataContainer);
