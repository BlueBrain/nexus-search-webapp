import React from "react";
import FacetShowMore from "./ShowMore";
import FacetBody from "./Body";

const MAX_VISIBLE_FACET_OPTIONS = 5;

const FacetTitle = ({ title, total, numFilters }) => (
  // TOOD make a title normalizer?
  <div className="filter-title flex space-between">
    <p>{title}</p>
    <span>
      {numFilters} ({total})
    </span>
  </div>
);

const FacetSubgroup = (key, subFacet, onSelect) => {
  // TODO sanity check this!
  if (subFacet.doc_count) {
    throw new Error("This nested facet could not be rendered", subFacet);
  }
  let total = subFacet.buckets.reduce(
    (memo, bucket) => (memo += bucket.doc_count),
    0
  );
  let visibleFacetOptions =
    subFacet.buckets.slice(0, MAX_VISIBLE_FACET_OPTIONS);
  let defaultValue = subFacet.buckets
    .filter(bucket => !!bucket.selected)
    .map(bucket => bucket.key);
  const onChange = value => {
    onSelect(key, value);
  };
  return (
    <li key={key} className="facet-subgroup">
      <FacetTitle
        title={key}
        total={total}
        numFilters={subFacet.buckets.length}
      />
      <FacetBody
        defaultValue={defaultValue}
        onChange={onChange}
        options={visibleFacetOptions}
      >
        {subFacet.buckets.length > MAX_VISIBLE_FACET_OPTIONS && (
          <FacetShowMore
            title={key}
            label={
              <a>
                See {subFacet.buckets.length - MAX_VISIBLE_FACET_OPTIONS} More >
              </a>
            }
            content={
              <FacetBody
                defaultValue={defaultValue}
                onChange={onChange}
                options={subFacet.buckets}
              />
            }
          />
        )}
      </FacetBody>
    </li>
  );
};

export default FacetSubgroup;
