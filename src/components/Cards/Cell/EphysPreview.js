import React, { PureComponent } from "react";
import { find } from "underscore";

const BEST_TRACE = "IDrest"

function getBestTrace (traces) {
  let best = find(traces, trace => trace.stimulus && trace.stimulus.label === BEST_TRACE);
  if (best) { return best; }
  return traces[0];
}

function getPreviewFromTrace (trace) {
  return trace.previewImage.thumbnail.url;
}

class EphysPreview extends PureComponent {
  state = { src: null, trace: null }
  componentDidMount() {
    this.processImage();
  }
  componentDidUpdate() {
    this.processImage();
  }

  processImage () {
    let trace = getBestTrace(this.props.traces);
    let src = getPreviewFromTrace(trace);
    let image = new Image();
    image.crossOrigin = "";
    image.onload = () => {
      this.setState({ src, trace })
    };
    image.onerror = () => this.setState({ src: null });
    image.src = src
  }
  render() {
    let { src, trace } = this.state;
    let { disabled } = this.props;
    return (
      <div className="ephys" style={{ zIndex: 1 }}>
        {src &&
          <div className={`stimulus fade ${disabled ? "" : "in"}`}>
            <div className="label">{trace.stimulus && trace.stimulus.label}</div>
            <img src={src} />
          </div>
        }
      </div>
    );
  }
}

export default EphysPreview;
