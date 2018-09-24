import React from "react";
import { connect } from "react-redux";
import Dygraph from "dygraphs";
import randomColor from "randomcolor";

const COLOR_SETTINGS = {
  luminosity: "light",
  hue: "blue"
};

const DEFAULT_COLOR = randomColor({
  count: 1,
  ...COLOR_SETTINGS
})[0];

function legendFormatter(data) {
  const g = data.dygraph;

  if (g.getOption('showLabelsOnHighlight') !== true) return '';

  const sepLines = g.getOption('labelsSeparateLines');
  let html;

  if (typeof data.x === 'undefined') {
    if (g.getOption('legend') !== 'always') {
      return '';
    }

    html = '';
    for (let i = 0; i < data.series.length; i++) {
      const series = data.series[i];
      if (!series.isVisible) continue;

      html += `<span style='font-weight: bold; color: ${series.color};'>${series.labelHTML}</span>`;
    }
    return html;
  }

  html = `time: ${data.xHTML}`;
  for (let i = 0; i < data.series.length; i++) {
    const series = data.series[i];
    if (!series.isVisible) continue;
    if (sepLines) html += '';
    const cls = series.isHighlighted ? ' class="highlight"' : '';
    html += `<span${cls}> <b><span style='color: ${series.color};'>${series.labelHTML}</span></b>:&#160;${series.yHTML}</span>`;
  }
  return html;
}

class GraphContainer extends React.Component {
  refCallback (label) {
    return element => {
      this[label + "Container"] = element;
    };
  }
  makeGraph () {
    const { config, onHighlight, onZoom, data, sweeps, yLabel } = this.props;
    if (this.graphContainer && data) {
      const formattedConfig = Object.assign({
        legendFormatter,
        // height: 260,
        colors: sweeps ? sweeps.map(sweep => sweep.color) : [DEFAULT_COLOR],
        labels: sweeps ? ['time'].concat(sweeps.map(sweep => sweep.sweepKey)) : ['time', 'model'],
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
        ylabel: yLabel,
        axes: {
          x: {
            valueFormatter: v => v.toFixed(2),
          },
          y: {
            valueFormatter: v => v.toFixed(2),
          },
        },
      }, this.props.config);
      this.graph = new Dygraph(this.graphContainer, data, formattedConfig);
    }
  }
  componentWillUnmount () {
    if (this.graph) {
      this.graph.destroy();
    }
  }
  componentDidMount () {
    if (!this.graph) {
      this.makeGraph()
    }
  }
  componentDidUpdate (nextProps) {
    if (this.graph) {
      if (nextProps.data !== this.props.data) {
        return this.resetGraph()
      } else {
        this.updateGraph();
      }
    } else {
      this.makeGraph()
    }
  }
  resetGraph () {
    this.graph.destroy();
    this.makeGraph();
  }
  updateGraph () {
    if (!this.props.selectedSweep) {
      this.graph.clearSelection();
    } else {
      this.graph.setSelection(null, this.props.selectedSweep, true);
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
