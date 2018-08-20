import React from "react";
import { Spin } from "antd";
import DetailsFrame from "./Frame";

const Details = props => {
  let { pending, error, data, types, id } = props;
  return (
    <div style={{ textAlign: "center", minHeight: "100vh"}}>
      <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
          {!pending && data && DetailsFrame({ data, types, id })}
      </Spin>
    </div>
  );
}

export default Details;