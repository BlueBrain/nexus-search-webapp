import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import FacetGroup from "./Group";

// what to show when facets have been loaded already
// TODO add No Data To Show div
const FacetsFulfilled = (facets, onSelect, pending) => {
  return (
    <div>
      <Spin spinning={pending} delay={300} style={{marginTop: "2em"}}>
      <ul>
        {facets.map(facet =>
          FacetGroup(facet.key, facet, onSelect)
        )}
      </ul>
      </Spin>
    </div>
  );
};

// Top-level facets component
const FacetsComponent = ({ facets, pending, onSelect }) => {
  return (
    <div id="facets">
      {FacetsFulfilled(facets, onSelect, pending)}
    </div>
  );
};

FacetsComponent.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedFacets: PropTypes.any.isRequired,
  facets: PropTypes.any.isRequired,
  pending: PropTypes.bool
};

export default FacetsComponent;
