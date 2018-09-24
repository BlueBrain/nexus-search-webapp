import React from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import Chart from "./Chart";
import Legend from "./Legend";
import Sweeps from "./Sweeps";
import WithTraceData from "./WithTraceData";

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
                  <Sweeps
                    sweeps={sweeps}
                    selectedSweep={selectedSweep}
                    onSelectSweep={handleSelectSweep}
                  />
                  <Chart
                    label="Cell Model Response Simulation"
                    yLabel={"voltage [mV]"}
                    data={modelData}
                  />
                  <Chart
                    label="Experimental Cell Response"
                    yLabel={"voltage [mV]"}
                    data={expData}
                    selectedSweep={selectedSweep}
                    sweeps={sweeps}
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
