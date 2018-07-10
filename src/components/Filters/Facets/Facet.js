import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Row, Col, Tooltip } from "antd";

const FacetCheckbox = ({ label, value, amount, selected }) => {
  return (
    <Tooltip title={label}>
      <Checkbox value={value} checked={selected} className="facet-checkbox">
        <span className="label ellipsis">{label}</span>
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
