import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import TypeButton from "./TypeButton";

const TypesComponent = ({ pending, selectedType, types, onHover, onSelect, clearFilters }) => (
  <div id="types">
    <div className="filter-title flex space-between">
      <p>Categories</p>
      <a onClick={clearFilters}>clear filters</a>
    </div>
    {pending && <div className="filter-title flex center" style={{width:"100%", margin: "40px auto"}}><Spin /></div>}
    {types &&
      types.map(props => TypeButton({ onSelect, selectedType, onHover, ...props }))}
    <div className="filter-title flex space-between">
      {/* <a onClick={clearFilters}>see more <Icon type="down"/></a> */}
    </div>
  </div>
);

TypesComponent.propTypes = {
  clearFilters: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  types: PropTypes.any.isRequired,
  selectedType: PropTypes.string.isRequired
};

export default TypesComponent;