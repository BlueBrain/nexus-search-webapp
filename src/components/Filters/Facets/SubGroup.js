import React from "react";
import Facet from "./Facet";
import { Checkbox } from "antd";

const CheckboxGroup = Checkbox.Group;
const MAX_VISIBLE_FACET_OPTIONS = 5;

const FacetTitle = ({ title, total, numFilters }) => (
  // TOOD make a title normalizer?
  <div className="filter-title flex space-between">
  <p>{title}</p>
  <span>{numFilters}{" "}({total})</span>
</div>
);

const FacetBody = ({ children, style}) => (
  <div className="subfacet-body" style={style}>{children}</div>
);

const FacetSubgroup = (key, subFacet, onSelect, selectedFacets) => {
  console.log({ subFacet, selectedFacets });
  // TODO sanity check this!
  if (subFacet.doc_count) { throw new Error('This nested facet could not be rendered', subFacet); }
  let total = subFacet.buckets.reduce((memo, bucket) => memo += bucket.doc_count, 0);
  let visibleFacetOptions = subFacet.buckets.slice(0, MAX_VISIBLE_FACET_OPTIONS);
  let selected = null;
  console.log({visibleFacetOptions})
  return (
    <li key={key}>
      <FacetTitle title={key} total={total} numFilters={subFacet.buckets.length} />
      <FacetBody>
        <CheckboxGroup style={{ width: "100%" }} defaultValue={selected} onChange={value => onSelect(key, value)}>
          {visibleFacetOptions.map(({ key:choiceKey, doc_count }, index) => (
            <Facet
              key={`${choiceKey}-${index}`}
              label={choiceKey}
              value={choiceKey}
              selected={selected}
              amount={doc_count}
              onClick={value => onSelect(choiceKey, value)}
            />
          ))}
        </CheckboxGroup>
        {/* {facetOptions.length > MAX_VISIBLE_FACET_OPTIONS && <FacetShowMore facet={facet} onSelect={onSelect}/>} */}
      </FacetBody>
    </li>
  )
}

export default FacetSubgroup;