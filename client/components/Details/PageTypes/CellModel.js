import React from "react";
import { Button, Icon } from "antd";
import { getProp } from "@libs/utils";
import TypeIcon from "../../NewTypeIcon";
import MorphologyPreview from "../../Cards/Cell/MorphologyPreview";
import Download from "../../Download";
import moment from "moment";

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
  return (
    <h2>
      <Icon type="user-add" /> by <a href={`mailto:${email}`}>{name}</a> on{" "}
      <span className="date">{date}</span>
    </h2>
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
      {files.length && (
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
  return (
    <div className="more-details">
      <h2>{brainRegion}</h2>
    </div>
  )
}

export default function CellModelDetailsPage(instance) {
  console.log(instance);
  return (
    <article id="details">
      <Header instance={instance} />
      <Hero instance={instance} />x
      <Details instance={instance} />
    </article>
  );
}
