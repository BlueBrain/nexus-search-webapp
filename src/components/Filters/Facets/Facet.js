import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Row, Col, Tooltip } from "antd";

const FacetCheckbox = ({ label, value, amount, selected, onClick }) => {
  return (
    <Row className="facet-checkbox" onClick={() => onClick(value)}>
      <Col span={3}>
        <Checkbox value={value} checked={true} />
      </Col>
      <Col span={16}>
        <Tooltip title={label}>
          <div className="label ellipsis">{label}</div>
        </Tooltip>
      </Col>
      <Col span={4}>{amount}</Col>
    </Row>
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
