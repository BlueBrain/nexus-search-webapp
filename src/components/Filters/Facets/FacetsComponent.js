import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import FacetGroup from "./Group";

// what to show when facets are loading
const FacetsPending = () => {
  return (
    <div
      className="filter-title flex center"
      style={{ width: "100%", margin: "40px auto" }}
    >
      <Spin />
    </div>
  );
};

// what to show when facets have been loaded already
const FacetsFulfilled = (facets, onSelect) => {
  return (
    <div>
      <ul>
        {facets.map(facet =>
          FacetGroup(facet.key, facet, onSelect)
        )}
      </ul>
    </div>
  );
};

// return {bool} - When do we show FacetsFulfilled?
const showFacetsMaybe = (pending, facets) =>
  !pending && facets && !!facets.length;

// Top-level facets component
const FacetsComponent = ({ facets, pending, onSelect }) => {
  return (
    <div id="facets">
      {pending && FacetsPending()}
      {showFacetsMaybe(pending, facets) &&
        FacetsFulfilled(facets, onSelect)}
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
