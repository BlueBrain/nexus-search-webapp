import React from "react";
import { Divider } from "antd";
import FacetSubGroup from "./SubGroup";

const FacetGroup = (key, facet, onSelect) => {
  let facetGroupSelect = (subGroupKey, value) => onSelect(key + "." + subGroupKey, value)
  let subGroupKeys = Object.keys(facet)
  .filter(key => key !== "doc_count" && key !== "key")
  .filter(key => !!facet[key].buckets.length);
  return (
    <li key={key} className="facet-group">
      <Divider orientation="left">{key}</Divider>
      <ul className="facet-subgroup">
        {subGroupKeys.map(key => FacetSubGroup(key, facet[key], facetGroupSelect))}
      </ul>
    </li>
  );
};

export default FacetGroup;