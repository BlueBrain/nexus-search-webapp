import React from "react";
import { connect } from "react-redux";
import Dygraph from "dygraphs";
import trace from "./trace2.json";

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
    console.log({csvHeader});
    let voltageTime
    // let g = new Dygraph(
    //   // containing div
    //   element,

    //   // CSV or path to a CSV file.
    //   "Time," + trace.reduce((memo, val, index) => {
    //     if (index % 2 === 0) {
    //       memo += val;
    //     } else {
    //       memo += `,${val}\n`;
    //     }
    //     return memo;
    //   }, "")
    // );
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
