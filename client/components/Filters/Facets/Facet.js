import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Tooltip, Tag } from "antd";
import FontAwesome from "react-fontawesome";

function splitStringInTwain(str) {
  let middle = Math.ceil(str.length / 2);
  let start = str.slice(0, middle);
  let end = str.slice(middle);
  return [start, end];
}

function Label(label) {
  if (label === "Experimental") {
    return (
      <div className="label">
        <Tag color="#90eac3">
          <FontAwesome name={"flask"} /> Experimental
        </Tag>
      </div>
    );
  }
  if (label === "In Silico") {
    return (
      <div className="label">
        <Tag color="#00c4ff">
          <FontAwesome name={"microchip"} /> In Silico
        </Tag>
      </div>
    );
  }
  return <span className="label">{label}</span>;
}

const FacetCheckbox = ({ label, value, amount, selected }) => {
  // let [start, end] = splitStringInTwain(label);
  return (
    <Tooltip title={label}>
      <Checkbox value={value} checked={selected} className="facet-checkbox">
        {/* <span className="label" data-content-start={start} data-content-end={end}></span> */}
        <div className="label-container">
        {Label(label)}
        <span className="amount">{amount}</span>

        </div>
      </Checkbox>
    </Tooltip>
  );
};

PropTypes.FacetCheckbox = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.string
};

export default FacetCheckbox;
