import React from "react";
import { Spin } from "antd";
import { getProp } from "@libs/utils";
import pageTypes from "./PageTypes";

function getPageType (instanceData, types) {
  // @type is expanded because this is the resource API
  // and not the elastic search API
  // so we have to match the type differenty
  let resultType = getProp(instanceData, "@type").split("/").pop();
  let typesWithoutPrevix = Object.keys(types).reduce((memo, key) => {
    let keyWithoutPrefix = key.split(":").pop();
    memo[keyWithoutPrefix] = types[key];
    return memo;
  }, {})
  let typeLabel = getProp(typesWithoutPrevix[resultType] || {}, "label");
  // TODO there may be some exceptions and edge cases here
  // that will have to be attended to later
  // This makes the assumption that we only distinguish by dimensions
  // of type x studyType
  return pageTypes.getPageType(typeLabel, instanceData.studyType.label);
}

const Details = props => {
  let { pending, error, data, types} = props;
  return (
    <div style={{ minHeight: "100vh" }}>
      <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
          {!pending && data && getPageType(data, types)({ data })}
          {pending &&
            <article id="details" style={{ minHeight: "100vh" }}></article>
          }
      </Spin>
    </div>
  );
}

export default Details;
