import React from "react";
import { Popover } from "antd";
import PropTypes from "prop-types";

const FacetShowMore = ({ content, label, title }) => {
  return (
    <div className="filter-title flex" style={{ justifyContent: "flex-end" }}>
      <Popover placement="right" title={title} content={content} trigger="click">
        {label}
      </Popover>
    </div>
  )
}

FacetShowMore.propTypes = {
  label: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired
};

export default FacetShowMore;