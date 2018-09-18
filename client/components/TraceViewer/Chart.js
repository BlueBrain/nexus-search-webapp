import React from "react";
import { connect } from "react-redux";
import Dygraph from "dygraphs";

class GraphContainer extends React.Component {
  refCallback (label) {
    return element => {
      this[label + "Container"] = element;
    };
  }
  makeGraph () {
    const { config, onHighlight, onZoom } = this.props;
    if (this.graphContainer) {
      const formattedConfig = Object.assign({
        // legendFormatter,
        height: 260,
        // labels: this.labels,
        labelsSeparateLines: true,
        labelsDiv: this.labelsContainer,
        highlightSeriesBackgroundAlpha: 0.1,
        highlightSeriesOpts: {
          strokeWidth: 1,
          strokeBorderWidth: 3,
          highlightCircleSize: 3,
        },
        highlightCircleSize: 2,

        highlightCallback: onHighlight,
        unhighlightCallback: onHighlight,
        zoomCallback: onZoom,

        xlabel: 'time [ms]',
        xLabelHeight: 14,
        ylabel: 'voltage [mV]',
        axes: {
          x: {
            valueFormatter: v => v.toFixed(2),
          },
          y: {
            valueFormatter: v => v.toFixed(2),
          },
        },
      }, this.props.config);
      const data = [
        [1,10,100],
        [2,20,80],
        [3,50,60],
        [4,70,80]
      ];
      this.graph = new Dygraph(this.graphContainer, data, formattedConfig);
    }
  }
  componentDidMount () {
    this.makeGraph();
  }
  componentWillUnmount () {
    if (this.graph) {
      this.graph.destroy();
    }
  }
  render() {
    const { label } = this.props;
    return (
      <div className="trace-container">
        <h3>{label}</h3>
        <div className="trace-graph">
          <div className="graph-container" ref={this.refCallback("graph")} />
        </div>
        <div className="trace-graph-labels" ref={this.refCallback("labels")} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(GraphContainer);
