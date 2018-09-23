import React from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import Chart from "./Chart";
import Legend from "./Legend";
import Sweeps from "./Sweeps";
import WithTraceData from "./WithTraceData";

// const COLOR_SETTINGS = {
//   luminosity: "light",
//   hue: "blue"
// };

class TraceViewerContainer extends React.Component {
  state = {
    sweeps: [],
    selectedSweep: null,
    selectedProtocol: null,
    selectedCell: null,
    stimulusData: [],
    responseData: []
  };
  // async fetchTraces() {
  //   let response = await fetch(this.props.traceURL);
  //   let traceData = await response.json();
  //   if (traceData.values) {
  //     const sweepCollection = Object.keys(traceData.values).map(sweepKey => ({
  //       sweepKey,
  //       current: traceData.values[sweepKey],
  //       segments: traceData.values[sweepKey].i_segments
  //     }));
  //     let sweeps = sortBy(sweepCollection, sweep => sweep.current[0]);
  //     let palette = randomColor({
  //       count: sweeps.length,
  //       ...COLOR_SETTINGS
  //     });

  //     sweeps = sweeps.map((sweep, index) =>
  //       Object.assign(sweep, { color: palette[index] })
  //     );

  //     // TODO optimize! use only a single reduce!
  //     const { dt, dur } = traceData;
  //     const times = Array.apply(null, { length: dur / dt }).map(
  //       (value, index) => index * dt
  //     );
  //     let stimulusData = [];
  //     let responseData = [];

  //     times.forEach((time, index) => {
  //       stimulusData.push(
  //         sweeps.reduce(
  //           (acc, sweep) =>
  //             acc.concat(traceData.values[sweep.sweepKey].i[index]),
  //           [time]
  //         )
  //       );
  //       responseData.push(
  //         sweeps.reduce(
  //           (acc, sweep) =>
  //             acc.concat(traceData.values[sweep.sweepKey].v[index]),
  //           [time]
  //         )
  //       );
  //     });

  //     this.setState({
  //       sweeps,
  //       stimulusData,
  //       responseData,
  //       status: "fulfilled"
  //     });
  //   }
  // }
  componentDidCatch(error, info) {
    console.error(error);
    this.setState({ status: "error" });
  }
  handleSelectSweep(sweepKey) {
    const { selectedSweep } = this.state;
    // if the user clicked on an already slected sweep, remove selection
    if (selectedSweep === sweepKey) {
      return this.setState({ selectedSweep: null });
    }
    this.setState({ selectedSweep: sweepKey });
  }
  handleSelectProtocol(protocol) {
    this.setState({ selectedProtocol: protocol });
  }
  handleSelectCell(cell) {
    this.setState({ selectedCell: cell });
  }
  render() {
    let {
      sweeps,
      selectedSweep,
      selectedCell,
      stimulusData,
      responseData,
      selectedProtocol
    } = this.state;
    const { traces } = this.props;
    const protocols = Object.keys(traces);
    selectedProtocol = selectedProtocol || "Step_140";
    const cells = traces[selectedProtocol].exp.map(exp => exp.name);
    selectedCell = selectedCell || cells[0];
    const handleSelectSweep = this.handleSelectSweep.bind(this);
    const handleSelectProtocol = this.handleSelectProtocol.bind(this);
    const handleSelectCell = this.handleSelectCell.bind(this);
    return (
      <div className="trace-viewer">
        <Legend
          cells={cells}
          protocols={protocols}
          onSelectProtocol={handleSelectProtocol}
          onSelectCell={handleSelectCell}
          selectedCell={selectedCell}
          selectedProtocol={selectedProtocol}
        />
        <WithTraceData
          {...{ selectedProtocol, selectedCell, selectedSweep, traces }}
          render={({ isPending, expData, modelData, currentData, sweeps }) => {
            return (
              <Spin spinning={isPending}>
                <div className="loadable-aread">
                  <Sweeps
                    sweeps={sweeps}
                    selectedSweep={selectedSweep}
                    onSelectSweep={handleSelectSweep}
                  />
                  <Chart
                    label="Exp. Cell Response"
                    yLabel={"voltage [mV]"}
                    data={expData}
                    selectedSweep={selectedSweep}
                    sweeps={sweeps}
                  />
                  <Chart
                    label="Cell Model Response"
                    yLabel={"voltage [mV]"}
                    data={modelData}
                  />
                  <Chart
                    label="Stimulus"
                    yLabel={"current [pA]"}
                    data={currentData}
                    selectedSweep={selectedSweep}
                    sweeps={sweeps}
                  />
                </div>
              </Spin>
            );
          }}
        />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(TraceViewerContainer);
