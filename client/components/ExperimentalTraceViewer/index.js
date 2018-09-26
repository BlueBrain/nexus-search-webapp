import React from "react";
import { connect } from "react-redux";
import { Spin, Popover, Icon } from "antd";
import Chart from "./Chart";
import Legend from "./Legend";
import Sweeps from "./Sweeps";
import WithTraceData from "./WithTraceData";

const HelperContent = (
  <div>
    <p>Lorem Ipsum</p>
  </div>
);

class TraceViewerContainer extends React.Component {
  state = {
    sweeps: [],
    selectedSweep: null,
    selectedProtocol: null
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
  render() {
    let { selectedSweep, selectedProtocol } = this.state;
    const { traces } = this.props;
    const protocols = Object.keys(traces);
    selectedProtocol = selectedProtocol || "IDRest";
    const handleSelectSweep = this.handleSelectSweep.bind(this);
    const handleSelectProtocol = this.handleSelectProtocol.bind(this);
    return (
      <div className="trace-viewer">
        <Legend
          protocols={protocols}
          onSelectProtocol={handleSelectProtocol}
          selectedProtocol={selectedProtocol}
        />
        <WithTraceData
          {...{ selectedProtocol, selectedSweep, traces }}
          render={({ status, responseData, currentData, sweeps }) => {
            const isPending = status === "pending";
            if (status === "error") {
              return <div className="loadable-aread">something broke!</div>;
            }
            return (
              <Spin spinning={isPending}>
                <div className="loadable-aread">
                  <h3>
                    <Icon type="line-chart" theme="outlined" /> Trace Viewer{" "}
                    <Popover
                      content={HelperContent}
                      arrowPointAtCenter
                      title="Trace Viewer"
                    >
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
                    label="Cell Response"
                    yLabel={"voltage [mV]"}
                    data={responseData}
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
