import React from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import TypeIcon from "../../TypeIcon";

const TypeButtonComponent = ({ selectedType, color, label, value, icon, amount, onSelect, onHover }) => {
  let selected = selectedType === value ? "selected" : "";
  return (
      <div key={value} className={"type " + selected} onMouseLeave={() => onHover(null)} onMouseEnter={() => onHover(value)} onClick={() => onSelect(value)}>
        <Card bodyStyle={selectedType === value ? { backgroundColor : "#b9e9d417"}: {}}>
          <div className="flex space-between"><TypeIcon iconURL={icon} color={color} /><span style={{flexGrow: 1, padding: '0 1em'}}>{label}</span><span style={{color: '#80808094'}}>{amount}</span></div>
        </Card>
      </div>
  )
}

TypeButtonComponent.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  color: PropTypes.string,
  selectedType: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  amount: PropTypes.number,
};

export default TypeButtonComponent;