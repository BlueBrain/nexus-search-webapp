import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Tooltip } from "antd";

function splitStringInTwain (str) {
  let middle = Math.ceil(str.length / 2);
  let start = str.slice(0, middle);
  let end = str.slice(middle);
  return [start, end];
}

const FacetCheckbox = ({ label, value, amount, selected }) => {
  // let [start, end] = splitStringInTwain(label);
  return (
    <Tooltip title={label}>
      <Checkbox value={value} checked={selected} className="facet-checkbox">
        {/* <span className="label" data-content-start={start} data-content-end={end}></span> */}
        <span className="label">{label}</span>
        <span className="amount">{amount}</span>
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
