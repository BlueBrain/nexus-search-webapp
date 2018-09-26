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
      protocols,
      selectedProtocol,
      onSelectProtocol
    } = this.props;
    return (
      <div className="legend">
        <div>
        <label htmlFor="stimulus-type">Stimulus Type</label><br/>
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
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(LabelContainer);
