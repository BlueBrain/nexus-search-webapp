import React from "react";
import { connect } from "react-redux";
import { Spin, Popover } from "antd";
import Chart from "./Chart";
import Legend from "./Legend";
import Sweeps from "./Sweeps";
import WithTraceData from "./WithTraceData";

const HelperContent = (
  <div>
    <p>
      Electrophysiological properties for cell models are derived from
      electrophysiological recordings from experimental cells. The below graphs
      show experimental recordings (stimulus traces and the corresponding
      experimental cell response traces) which were used to model
      electrophysiological features for the cell models. The experimental traces
      are sorted by intensity of injected current (given in picoampere; pA).{" "}
    </p>
    <p>
      At the bottom you can see an example trace from the cell model for the
      derived feature.
    </p>
    <p>
      At the top, you can select features and experimental cells used to derive
      those features from drop-down menus. Feature names consist of the name
      (e.g. "Step") and the current applied expressed as percentage of the
      firing threshold of the cell (e.g. "140").
    </p>
  </div>
);

class TraceViewerContainer extends React.Component {
  state = {
    sweeps: [],
    selectedSweep: null,
    selectedProtocol: null,
    selectedCell: null,
    stimulusData: [],
    responseData: []
  };
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
    const cellNameList = traces[selectedProtocol].exp.map(exp => exp.name);
    selectedCell = selectedCell || cellNameList[0];
    const handleSelectSweep = this.handleSelectSweep.bind(this);
    const handleSelectProtocol = this.handleSelectProtocol.bind(this);
    const handleSelectCell = this.handleSelectCell.bind(this);
    return (
      <div className="trace-viewer">
        <Legend
          cells={cellNameList}
          cellLegend={traces[selectedProtocol].exp}
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
                  <h3>
                    Trace Viewer{" "}
                    <Popover content={HelperContent} arrowPointAtCenter title="Trace Viewer">
                      <a className="more-info">more info</a>
                    </Popover>
                  </h3>
                  <Sweeps
                    sweeps={sweeps}
                    selectedSweep={selectedSweep}
                    onSelectSweep={handleSelectSweep}
                  />
                  <Chart
                    label="Stimulus"
                    yLabel={"current [pA]"}
                    data={currentData}
                    selectedSweep={selectedSweep}
                    sweeps={sweeps}
                  />
                  <Chart
                    label="Experimental Cell Response"
                    yLabel={"voltage [mV]"}
                    data={expData}
                    selectedSweep={selectedSweep}
                    sweeps={sweeps}
                  />
                  <Chart
                    label="Cell Model Response Simulation"
                    yLabel={"voltage [mV]"}
                    data={modelData}
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
