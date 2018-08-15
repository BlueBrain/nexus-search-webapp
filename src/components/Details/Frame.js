import React from "react";
import { Row, Col, Divider } from "antd";
import MorphologyPreview from "../Cards/Cell/MorphologyPreview";
import Summary from "./Summary";
import Extensions from "./Extensions";
import MoreLikeThis from "./MoreLikeThis";
import { getProp } from "../../libs/utils"
import {Helmet} from "react-helmet";

const DetailsFrame = props => {
  let { data, types, id } = props;
  const description = `
    Cell from brainRegion ${getProp(data, "brainRegion.label")}, eType ${getProp(data, "eType.label")}, sampled from
    a ${getProp(data, "subject.sex.label")} ${getProp(data, "subject.species.label")}
  `
  return (
    <div id="details">
        <Helmet>
            <title>{`Nexus Search | Cell ${data.cellName.label}`}</title>
            <meta name="description" content={description} />
        </Helmet>
      <Row gutter={16} style={{ padding: "1em 0"}}>
        <Col span={14}>
          <div style={{ height: "700px"}}>
            <MorphologyPreview onHover={() => {}} value={data} shouldRender/>
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
          <Extensions data={data}/>
        </Col>
      </Row>
      <Divider>Similar</Divider>
      <Row gutter={16} style={{ padding: "1em 0"}}>
        <Col span={24}>
          <MoreLikeThis id={id}/>
        </Col>
      </Row>
    </div>
  );
}

export default DetailsFrame;