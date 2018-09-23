import React, { Component } from "react";
import { connect } from "react-redux";
import { Select } from "antd";

const Option = Select.Option;

class LabelContainer extends Component {
  render() {
    const {
      cells,
      protocols,
      selectedProtocol,
      selectedCell,
      onSelectCell,
      onSelectProtocol
    } = this.props;
    return (
      <div className="legend">
        <Select
          defaultValue={selectedProtocol}
          style={{ width: 200, marginRight: "1em" }}
          onChange={value => onSelectProtocol(value)}
        >
          {protocols.map(protocolKey => (
            <Option key={protocolKey} value={protocolKey}>
              {protocolKey}
            </Option>
          ))}
        </Select>
        <Select
          defaultValue={selectedCell}
          style={{ width: 200 }}
          onChange={value => onSelectCell(value)}
        >
          {cells.map(cellKey => (
            <Option key={cellKey} value={cellKey}>
              {cellKey}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(LabelContainer);
