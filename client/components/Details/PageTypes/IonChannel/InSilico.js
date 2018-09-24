import React from "react";
import { Button, Icon, Row, Col, Divider, Tag } from "antd";
import moment from "moment";
import { getProp } from "@libs/utils";
import TypeIcon from "../../../NewTypeIcon";
import Download from "../../../Download";
import { eTypes, mTypes } from "../../../../../consts";
import BrainRegionLink from "../../../BrainRegionLink";
import FontAwesome from "react-fontawesome";
import Subject from "../Subject";
import ProvList from "../ProvList";
const DEFAULT_CELL_MODEL_NAME = "Cell Model";

function getUUIDFromAtID(instance) {
  let id = instance["@id"];
  return id.split("/").slice(-1)[0];
}

function getExplorerLink(instance) {
  let id = instance["@id"];
  let dataIndex = id.indexOf("data");
  let explorerPath = id.slice(dataIndex).replace("data/", "explorer/");
  let basePath = id
    .substring(0, dataIndex)
    .replace("v0/", "")
    .replace("v1/", "");
  return basePath + explorerPath;
}

function attributionLine(instance) {
  let contribution = getProp(instance, "contribution", {});
  let name = getProp(contribution, "fullName");
  let email = getProp(contribution, "email");
  let date = moment(getProp(instance, "dateCreated")).format("MMM Do YYYY");
  return getProp(instance, "contribution") ? (
    <h2>
      <Icon type="user-add" /> by{" "}
      {email ? <a href={`mailto:${email}`}>{name}</a> : <span>{name}</span>} on{" "}
      <span className="date">{date}</span>
    </h2>
  ) : null;
}


function Header({ instance }) {
  return (
    <header className="flex">
      <div className="title flex">
        <div className="type-avatar">
          <picture>
            <TypeIcon type={instance["@type"]} />
          </picture>
        </div>
        <div>
          <h1>{getProp(instance, "name", DEFAULT_CELL_MODEL_NAME)}</h1>
          {attributionLine(instance)}
        </div>
      </div>
      <ul className="actions">
        {/* <li><Button>Save</Button></li> */}
        <li>
          <a target="_blank" href={getExplorerLink(instance)}>
            <Button>Open Explorer</Button>
          </a>
        </li>
      </ul>
    </header>
  );
}

function Hero({ instance }) {
  let files = [getProp(instance, "files")];
  return (
    <div className="hero">
      <div className="detail-hero">
        <Row>
          <Col span={8}>
            {files &&
              files.length && (
                <div className="detail-attachments">
                  {files.map(file => (
                    <div key={file.originalFileName}>
                      <picture className="file-code">
                        <FontAwesome name={"file-code"} size="4x" />
                      </picture>
                      <p>
                        <span>{file.originalFileName}</span>
                        <br />
                        <small>{file.mediaType}</small>
                      </p>
                    </div>
                  ))}
                  <h3>
                    <Icon type="paper-clip" />{" "}
                    <Download
                      files={files}
                      name={getProp(instance, "name", "Ion Channel")}
                    >
                      <a>
                        {files.length} File
                        {files.length > 1 ? "s" : ""}
                      </a>
                    </Download>
                  </h3>
                </div>
              )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

function Details({ instance }) {
  let usedBy = getProp(instance, "usedBy", []);
  return (
    <div className="more-details">
      <Row>
        <Col span={12}>
          <h2 className="mType">
            Ion Channel{" "}
            <Tag color="#00c4ff">
              <FontAwesome name={"microchip"} /> In Silico
            </Tag>
          </h2>
          <div className="eType">
            {getProp(instance, "cellType.eType") &&
              eTypes[getProp(instance, "cellType.eType")]}
          </div>
          <div className="brainRegion">
            <BrainRegionLink region={getProp(instance, "brainLocation.brainRegion")} />
          </div>
          <Subject subject={getProp(instance, "subject")} />
        </Col>
        <Col span={12}>
        <Divider>Provenance</Divider>
          {!!usedBy.length && (
            <ProvList
              title={`Used in ${usedBy.length} Cell Models`}
              provList={usedBy}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default function IonCannelModelDetailsPage({ data: instance }) {
  return (
    <article id="details">
      <Header instance={instance} />
      <Hero instance={instance} />
      <Details instance={instance} />
    </article>
  );
}
