import React from "react";
import { Checkbox } from "antd";
import Facet from "./Facet";

const CheckboxGroup = Checkbox.Group;

const FacetBodyContainer = ({ children, style }) => (
  <div className="subfacet-body" style={style}>
    {children}
  </div>
);

const FacetBody = ({ children, onChange, defaultValue, options }) => {
  return (
    <FacetBodyContainer>
        <CheckboxGroup
          style={{ width: "100%" }}
          defaultValue={defaultValue}
          onChange={onChange}
        >
          {options.map(
            ({ key: choiceKey, doc_count, selected }, index) => (
              <Facet
                key={`${choiceKey}-${index}`}
                label={choiceKey}
                value={choiceKey}
                selected={selected}
                amount={doc_count}
              />
            )
          )}
        </CheckboxGroup>
        {children}
      </FacetBodyContainer>
  );
};

export default FacetBody;