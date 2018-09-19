import React from "react";
import { connect } from "react-redux";
import dygraphs from "dygraphs";
import { Select } from "antd";

const Option = Select.Option;

class LabelContainer extends React.Component {
  render() {
    const {
      sweeps,
      selectedSweep,
      onSelectSweep,
      onSelectProtocol
    } = this.props;
    return (
      <div className="legend">
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
                onClick={() => onSelectSweep(sweep.sweepKey)}
                // onMouseEnter={() => onSelectSweep(sweep.sweepKey)}
                // onMouseLeave={() => onSelectSweep()}
              />
            );
          })}
        </ol>
        <div>
          {selectedSweep && (
            <div>
              <span>sweep: {selectedSweep}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(LabelContainer);
