import React, { Fragment } from "react";
import { Row, Col, Divider } from "antd";
import TypeIcon from "../TypeIcon";
import { find } from "underscore";
import { getProp } from "../../libs/utils";
import FontAwesome from "react-fontawesome";
import TraceViewer from "./TraceViewer";

const Summary = props => {
  let { data, types } = props;
  const mostRelevantType = Array.isArray(data["@type"])
          ? data["@type"][data["@type"].length - 1]
          : data["@type"];

        const myType = find(types, type => {
          return type.value === mostRelevantType;
        });
  return (
    <div>
      <Row gutter={16}>
        <Col span={3}>
          <div className="type-avatar">
            {myType && (
              <TypeIcon color={myType.color} iconURL={myType.icon} />
            )}
          </div>
        </Col>
        <Col span={12}>
          <div className="labels">
            {data.subject &&
              <Fragment>
                <div className="top-label">{data.subject.species.label}</div>
                <div className="bottom-label">{data.subject.strain.label}</div>
              </Fragment>
            }
          </div>
        </Col>
        <Col span={4}>
          <div className="name">{data.cellName.label}</div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <div className="mType">
            {getProp(data, "mType.label")}
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <div className="mType">
            {getProp(data, "brainRegion.label")}
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <div className="mType">
            {getProp(data, "eType.label")}
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
            <ul>
              {getProp(data, "contributions").map(contribution => {
                return (
                  <li key={contribution["@id"]}>
                    <FontAwesome name={"user"} />{" "}
                    <span className="pi">
                      {contribution.fullName}
                    </span>
                  </li>
                );
              })}
            </ul>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <TraceViewer traces={data.traces} />
        </Col>
      </Row>
    </div>
  );
}

export default Summary;