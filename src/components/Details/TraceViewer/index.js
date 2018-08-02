import React, { PureComponent } from "react";
import { Cascader, Row, Col, Icon } from 'antd';
import { getProp } from "../../../libs/utils";

const BEST_TRACE = "IDRest"

function confirmImageExists (imageSrc) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.crossOrigin = "";
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = imageSrc
  });
}

function tracesWithImages (traces) {
  return traces
    .filter(trace => !!getProp(trace, "previewImage.full.url"))
    .reduce((memo, trace) => {
      let stimulusKey = getProp(trace, "stimulus.label");
      let image = getProp(trace, "previewImage.full.url");
      let sweep = getProp(trace, "fileName").split("_").slice(-1)[0].split(".")[0];
      if (memo[stimulusKey]) {
        memo[stimulusKey][sweep] = image;
      } else {
        memo[stimulusKey] = {
          [sweep]: image
        };
      }
      return memo;
    }, {});
}


function makeOptions (traces) {
  let stimulusTypes = Object.keys(traces);
  return stimulusTypes.map(stimulusKey => {
    let sweeps = Object.keys(traces[stimulusKey]).map(sweepKey => {
      return {
        value: sweepKey,
        label: sweepKey
      }
    });
    return {
      value: stimulusKey,
      label: `${stimulusKey} (${sweeps.length})`,
      children: sweeps
    }
  });
}

function makeDefaultTraceSweep (traces) {
  // get default type, even if the cases are mixed up
  let stimulusTypes = Object.keys(traces);
  let bestStimulusTypeIndex = stimulusTypes.map(type => type.toLowerCase()).indexOf(BEST_TRACE.toLowerCase());
  if (bestStimulusTypeIndex < 0) { bestStimulusTypeIndex = 0};
  let defaultValue = stimulusTypes[bestStimulusTypeIndex];
  let sweepKeys = Object.keys(traces[defaultValue])
  let defaultSweep = sweepKeys[0];
  return [defaultValue, defaultSweep];
}

class EphysPreview extends PureComponent {
  state = { selectedTraceSweep: null }
  handleChange (value) {
    this.setState({ selectedTraceSweep: value });
  }
  getSelectedOrDefaultTup () {
    let { traces } = this.props;
    let { selectedTraceSweep } = this.state;
    let selectedOrDefaultArr = selectedTraceSweep ? selectedTraceSweep : makeDefaultTraceSweep(traces);
    return selectedOrDefaultArr;
  }
  handleNext () {
    let { traces } = this.props;
    let [ selectedTrace, selectedSweep ] = this.getSelectedOrDefaultTup();
    let sweepList = Object.keys(traces[selectedTrace]);
    let sweepIndex = sweepList.indexOf(selectedSweep);
    let newSweepKey = sweepList[sweepIndex + 1] || sweepList[0];
    this.setState({
      selectedTraceSweep: [selectedTrace, newSweepKey]
    })
  }
  handlePrev () {
    let { traces } = this.props;
    let [ selectedTrace, selectedSweep ] = this.getSelectedOrDefaultTup();
    let sweepList = Object.keys(traces[selectedTrace]);
    let sweepIndex = sweepList.indexOf(selectedSweep);
    let newSweepKey = sweepList[sweepIndex - 1] || sweepList[sweepList.length - 1];
    this.setState({
      selectedTraceSweep: [selectedTrace, newSweepKey]
    })
  }
  render() {
    let { traces } = this.props;
    let [ selectedTrace, selectedSweep ] = this.getSelectedOrDefaultTup();
    let options = makeOptions(traces);
    let src = traces[selectedTrace][selectedSweep];
    return (
      <div id="trace-viewer">
        <div className="toolbar">
          <label>Select Stimulus and sweep</label>
          <Row gutter={16} align="middle">
          <Col span={10}>
            <Cascader value={[ selectedTrace, selectedSweep ]} options={options} onChange={this.handleChange.bind(this)} allowClear={false}/>
          </Col>
          <Col span={8}>
            <span>
              Stimulus Type <em>{selectedTrace}</em>
            </span>
          </Col>
          <Col span={6}>
              <span>
                Sweep <em>{selectedSweep}</em>
              </span>
          </Col>
        </Row>
        </div>
        <div className="flex row justify-center">
          <a className="next left" onClick={this.handlePrev.bind(this)}><Icon type="left" /></a>
          {src &&
            <div className={"stimulus fade in slow"}>
              <img src={src} />
            </div>
          }
          <a className="next right" onClick={this.handleNext.bind(this)}><Icon type="right" /></a>
        </div>
      </div>
    );
  }
}

function WithFormattedTraces(Component) {
  return ({ traces, ...props }) => {
    return (
      <Component traces={tracesWithImages(traces)} {...props}/>
    );
  }
}

export default WithFormattedTraces(EphysPreview);
