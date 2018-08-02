import React from "react";
import { Spin } from "antd";
import DetailsFrame from "./Frame";

const Details = props => {
  let { pending, error, data, types } = props;
  return (
    <section id="details" className="column full flex">
      <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
        <div className="centered-content">
          {!pending && data && DetailsFrame({ data, types })}
        </div>
      </Spin>
    </section>
  );
}

export default Details;