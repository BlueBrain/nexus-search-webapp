import React from "react";
import { Row, Col, Divider } from "antd";
import MorphologyPreview from "../Cards/Cell/MorphologyPreview";
import Summary from "./Summary";
import Extensions from "./Extensions";

const DetailsFrame = props => {
  let { data, types } = props;
  return (
    <div>
      <Row gutter={16} style={{ padding: "1em 0"}}>
        <Col span={14}>
          <div style={{ height: "700px"}}>
            <MorphologyPreview onHover={() => {}} value={data}/>
          </div>
        </Col>
        <Col span={10}>
          <Summary {...props} />
        </Col>
      </Row>
      <Row gutter={16} style={{ padding: "1em 0"}}>
        <Col span={24}>
        </Col>
      </Row>
      <Divider>Extensions</Divider>
      <Row gutter={16} style={{ padding: "1em 0"}}>
        <Col span={24}>
          <Extensions />
        </Col>
      </Row>
    </div>
  );
}

export default DetailsFrame;