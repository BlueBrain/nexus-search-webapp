import React from "react";
import { Tag, Tooltip } from "antd";
import TypeIcon from "./TypeIcon";

export const hasMorphology = function({ children, skipText } = {}) {
  return (
    <Tooltip title={skipText ? null : "Has Morphology"}>
      <div className="data-type-tag">
        <Tag color="#f3bee7">
          <TypeIcon iconURL="neuron" className="data-type-icon" />
        </Tag>
        {children}
      </div>
    </Tooltip>
  );
};

export const hasElectrophysiology = function({ children, skipText } = {}) {
  return (
    <Tooltip title={skipText ? null : "Has Electrophysiology"}>
      <div className="data-type-tag">
        <Tag color="#f3bee7">
          <TypeIcon iconURL="spike" className="data-type-icon" />
        </Tag>
        {children}
      </div>
    </Tooltip>
  );
};
