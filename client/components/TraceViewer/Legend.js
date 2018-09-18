import React from "react";
import { connect } from "react-redux";
import dygraphs from "dygraphs";
import { Select } from "antd";

const Option = Select.Option;

class LabelContainer extends React.Component {
  render() {
    const { sweeps, selectedSweep, onSelectSweep, onSelectProtocol } = this.props;
    return (
      <div className="legend" style={{ margin: "0 0 1em 0" }}>
        <Select
          defaultValue="ID_Rest"
          style={{ width: 120 }}
          onChange={value => onSelectProtocol(value)}
        >
          <Option value="ID_Rest">ID_Rest</Option>
          <Option value="AP_Waveform">AP_Waveform</Option>
          <Option value="IV">IV</Option>
        </Select>
        <ol className="sweep-container">
          {sweeps.map(sweep => {
            return (
              <li
                key={sweep.sweepKey}
                className="sweep"
                style={{ backgroundColor: sweep.color }}
                onMouseEnter={() => onSelectSweep(sweep.sweepKey)}
                onMouseLeave={() => onSelectSweep(sweep.sweepKey)}
              />
            );
          })}
        </ol>
        <div>
          <span>sweep:{" "}</span><span>{selectedSweep}</span>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(LabelContainer);
