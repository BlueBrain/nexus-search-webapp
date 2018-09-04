import React from "react";
import { connect } from "react-redux";
import Dygraph from "dygraphs";
import trace from "./trace.json";

class TraceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.viewContainer = React.createRef();

    this.viewContainer = null;

    this.setViewContainer = element => {
      this.viewContainer = element;
      this.createGraph(element)
    };
  }
  createGraph (element) {
    if (!element) {
      return;
    }
    let g = new Dygraph(
      // containing div
      element,

      // CSV or path to a CSV file.
      "Time,mV\n" + trace.reduce((memo, val, index) => {
        if (index % 2 === 0) {
          memo += val;
        } else {
          memo += `,${val}\n`;
        }
        return memo;
      }, "")
    );
  }
  render() {
    return <div ref={this.setViewContainer} />;
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(TraceContainer);
