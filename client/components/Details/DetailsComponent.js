import React from "react";
import { Spin } from "antd";
import { getProp } from "@libs/utils";
import pageTypes from "./PageTypes";
import { ui as UI_CONSTS } from "@consts";
const { DEFAULT_SEARCH_TYPE_LABEL } = UI_CONSTS;

const PREFIX = "nxv:";
const PREFIX_MAP = "https://bluebrain.github.io/nexus/vocabulary/";

function getPageType(instanceData, types) {
  let resultType = getProp(instanceData, "@type")

  // TODO the prefixes are not expanded here...
  // maybe find a generalized way to resolve this
  if (resultType.indexOf(PREFIX) >= 0) {
    resultType = resultType.replace(PREFIX, PREFIX_MAP);
  }

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
