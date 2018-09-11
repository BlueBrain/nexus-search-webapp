import React from "react";
import { connect } from "react-redux";
import trace from "./trace2.json";

//TODO fetch traces remotely

class TraceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.voltageContainer = React.createRef();
    this.voltageContainer = null;

    this.currentContainer = React.createRef();
    this.currentContainer = null;

    this.setVoltageContainer = element => {
      this.voltageContainer = element;
      this.createGraph(element)
    };
    this.setCurrentContainer = element => {
      this.currentContainer = element;
      this.createGraph(element)
    };
  }
  createGraph (element) {
    if (!element) {
      return;
    }

    let csvHeader = "Time," + Object.keys(trace).join(",") + "\n";
    let voltageTime = Object.keys(trace).reduce((memo, valu, index) => {
      return voltageTime;
    }, "")

  }
  render() {
    return (
      <div>
        <div ref={this.setVoltageContainer} />
        <div ref={this.setCurrentContainer} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(TraceContainer);
