import React, { Fragment } from "react";
import { Button, Icon, Row, Col, Divider, Tag } from "antd";
import moment from "moment";
import { getProp } from "@libs/utils";
import TypeIcon from "../../../NewTypeIcon";
import MorphologyPreview from "../../../Cards/Cell/MorphologyPreview";
import Download from "../../../Download";
import { eTypes, mTypes } from "../../../../../consts";
import Extensions from "../../Extensions";
import BrainRegionLink from "../../../BrainRegionLink";
import Subject from "../Subject";
import FontAwesome from "react-fontawesome";
import ProvLink from "../ProvLink";
import TraceViewer from "../../../ModelTraceViewer";

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

function softwareLine(instance) {
  let name = getProp(instance, "software.name");
  let version = getProp(instance, "software.version");
  return (
    <p>
      <Icon type="code" /> generated using <em>{name}</em> v{version}
    </p>
  );
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
          <h1>
            {getProp(instance, "cellName.label", DEFAULT_CELL_MODEL_NAME)}
          </h1>
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
        <li>
          <a
            target="_blank"
            href={`http://bbp-blue-naas.ocp.bbp.epfl.ch/#/uuid/${getUUIDFromAtID(
              instance
            )}`}
          >
            <Button>Neuron as a service</Button>
          </a>
        </li>
      </ul>
    </header>
  );
}

function Hero({ instance }) {
  let files = getProp(instance, "files");
  return (
    <div className="hero">
      <div className="detail-hero">
        <picture style={{ height: "600px" }}>
          <MorphologyPreview onHover={() => {}} value={instance} shouldRender />
        </picture>
      </div>
      {files &&
        files.length && (
          <div className="detail-attachments">
            <h3>
              <Icon type="paper-clip" />{" "}
              <Download
                files={files}
                name={getProp(instance, "cellName.label", "Cell")}
              >
                <a>
                  {files.length} Attachment
                  {files.length > 1 ? "s" : ""}
                </a>
              </Download>
            </h3>
            <ul>
              <li />
            </ul>
          </div>
        )}
    </div>
  );
}

function Details({ instance }) {
  let brainRegion = getProp(instance, "brainLocation.brainRegion");
  let generatedEPhysFrom = getProp(instance, "generatedEPhysFrom", []);
  let generatedMorphologyFrom = getProp(instance, "generatedMorphologyFrom");
  return (
    <div className="more-details">
      <Row>
        <Col span={16}>
          <h2 className="mType">
            {getProp(instance, "cellType.mType")}{" "}
            <Tag color="#00c4ff">
              <FontAwesome name={"microchip"} /> In Silico
            </Tag>
          </h2>
          <div className="eType">
            {getProp(instance, "cellType.eType") &&
              eTypes[getProp(instance, "cellType.eType")]}
          </div>
          <div className="brainRegion">
            <BrainRegionLink
              region={getProp(instance, "brainLocation.brainRegion")}
            />{" "}
            ({getProp(instance, "brainLocation.layer")})
          </div>
          <Subject subject={getProp(instance, "subject")} />
          {softwareLine(instance)}
        </Col>
      </Row>
      <Row>
        <Divider>Electrophysiological Properties</Divider>
        <TraceViewer traces={getProp(instance, "traces")} />
      </Row>
      <Row>
        <Divider>Provenance</Divider>
        <Col span={12}>
          <p>ephys derived from {generatedEPhysFrom.length} Cells</p>
          <ul className="prov-list">
            {generatedEPhysFrom.map((entry, index) => {
              return (
                <li key={index + "-prov-link"}>
                  <ProvLink {...entry} />
                </li>
              );
            })}
          </ul>
        </Col>
        <Col span={12}>
          {generatedMorphologyFrom && (
            <Fragment>
              <p>morphology derived from 1 Cell</p>
              <ul className="prov-list">
                <li>
                  <ProvLink {...generatedMorphologyFrom} />
                </li>
              </ul>
            </Fragment>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default function CellModelDetailsPage({ data: instance }) {
  return (
    <article id="details">
      <Header instance={instance} />
      <Hero instance={instance} />
      <Details instance={instance} />
    </article>
  );
}
