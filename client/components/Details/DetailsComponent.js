import React from "react";
import { Spin } from "antd";
import * as pageTypes from "./pageTypes/index.js";

const DEFAULT_PAGE_TYPE = "CellModel";

function getPageType (instanceData) {
  return DEFAULT_PAGE_TYPE;
}

const Details = props => {
  let { pending, error, data} = props;
  const DetailsPageComponent = pageTypes[getPageType(data)];
  return (
    <div style={{minHeight: "100vh"}}>
      <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
          {!pending && data && DetailsPageComponent(data)}
      </Spin>
    </div>
  );
}

export default Details;