import React from "react";
import { connect } from "react-redux";
import dygraphs from "dygraphs";

class GraphContainer extends React.Component {
  refCallback (label) {
    return element => {
      this[label + "Container"] = element;
    };
  }
  render() {
    return (
      <div>
        <div ref={this.refCallback("graph")} />
        <div ref={this.refCallback("labels")} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(GraphContainer);
