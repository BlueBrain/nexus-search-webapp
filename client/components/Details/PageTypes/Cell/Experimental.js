import React from "react";
import { Button, Icon, Row, Col, Divider, Tag } from "antd";
import moment from "moment";
import { getProp } from "@libs/utils";
import TypeIcon from "../../../NewTypeIcon";
import MorphologyPreview from "../../../Cards/Cell/MorphologyPreview";
import Download from "../../../Download";
import {eTypes, mTypes} from "../../../../../consts";
import Extensions from "../../Extensions";
import TraceViewer from "../../../TraceViewer";
import BrainRegionLink from "../../../BrainRegionLink";
import Subject from "../Subject";
import FontAwesome from "react-fontawesome";
import ProvLink from "../ProvLink";

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
  let name =
    getProp(instance, "wasAttributedTo.givenName") +
    " " +
    getProp(instance, "wasAttributedTo.familyName");
  let email = getProp(instance, "wasAttributedTo.email");
  let date = moment(getProp(instance, "dateCreated")).format("MMM Do YYYY");
  return getProp(instance, "wasAttributedTo") ? (
    <h2>
      <Icon type="user-add" /> by <a href={`mailto:${email}`}>{name}</a> on{" "}
      <span className="date">{date}</span>
    </h2>
  ) : null ;
}

function softwareLine(instance) {
  let name = getProp(instance, "software.name")
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
      {files && files.length && (
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
  let brainRegion = getProp(instance, "brainRegion.label");
  let generatedFromCells = getProp(instance, "generatedFromCells", []);
  return (
    <div className="more-details">
      <Row>
        <Col span={16}>
        <h2 className="mType">
            Cell{" "}
            <Tag color="#90eac3">
              <FontAwesome name={"flask"} /> In Silico
            </Tag>
          </h2>
          <div className="eType">{getProp(instance, "eType.label") && eTypes[getProp(instance, "eType.label")]}</div>
          <div className="brainRegion"><BrainRegionLink region={getProp(instance, "brainRegion.label")} /> ({getProp(instance, "brainRegion.layer")})</div>
          <Subject subject={getProp(instance, "subject")} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Divider>Extensions</Divider>
          <Extensions data={instance} />
          <div className="secondary-hero" style={{marginTop: "1em", width: "100%"}}>
          <TraceViewer />
        </div>
        </Col>
      </Row>

    </div>
  )
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
