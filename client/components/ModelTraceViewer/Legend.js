import React, { Component } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { findWhere } from "underscore";
// TODO maybe refactor the file structure a bit...
import ProvLink from "../Details/PageTypes/ProvLink";

const Option = Select.Option;

class LabelContainer extends Component {
  render() {
    const {
      cells,
      cellLegend,
      protocols,
      selectedProtocol,
      selectedCell,
      onSelectCell,
      onSelectProtocol
    } = this.props;
    const selectedCellObj = findWhere(cellLegend, { name: selectedCell });
    return (
      <div className="legend">
        <div>
        <label for="stimulus-type">Stimulus Type</label>
        <Select name="stimulus-type"
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
        </div>
        <div>
        <label for="experimental-cell">Experimental Cell</label>
        <Select
          name="experimental-cell"
          defaultValue={selectedCell}
          style={{ width: 200, marginRight: "1em" }}
          onChange={value => onSelectCell(value)}
        >
          {cells.map(cellKey => (
            <Option key={cellKey} value={cellKey}>
              {cellKey}
            </Option>
          ))}
        </Select>
        </div>
        <ProvLink type={selectedCellObj.type} searchId={selectedCellObj.searchId} name={selectedCellObj.name} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(LabelContainer);
