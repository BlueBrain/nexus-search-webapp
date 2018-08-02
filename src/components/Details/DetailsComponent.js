import React from "react";
import { Spin } from "antd";
import DetailsFrame from "./Frame";

const Details = props => {
  let { pending, error, data, types } = props;
  return (
    <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
        {!pending && data && DetailsFrame({ data, types })}
    </Spin>
  );
}

export default Details;