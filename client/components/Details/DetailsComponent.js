import React from "react";
import { Spin } from "antd";
import { getProp } from "@libs/utils";
import pageTypes from "./PageTypes";
import { ui as UI_CONSTS } from "@consts";
const { DEFAULT_SEARCH_TYPE_LABEL } = UI_CONSTS;

function getPageType(instanceData, types) {
  let resultType = getProp(instanceData, "@type")

  let typeLabel = getProp(
    types[resultType] || {},
    "label",
    DEFAULT_SEARCH_TYPE_LABEL
  );

  // TODO these values need to be relegated to a consts folder
  let studyType = getProp(instanceData, "studyType.name");

  // TODO there may be some exceptions and edge cases here
  // that will have to be attended to later
  // This makes the assumption that we only distinguish by dimensions
  // of type x studyType
  return pageTypes.getPageType(
    typeLabel,
    studyType
  );
}

const Details = props => {
  let { pending, error, data, types } = props;
  return (
    <div style={{ minHeight: "100vh" }}>
      <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
        {!pending && data && getPageType(data, types)({ data })}
        {pending && <article id="details" style={{ minHeight: "100vh" }} />}
      </Spin>
    </div>
  );
};

export default Details;
