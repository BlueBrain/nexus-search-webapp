import React from "react";
import { WithStore, Shapes, CopyToClipboard } from "@bbp/nexus-react";
import { Layout } from "antd";
import { Card, Icon, Avatar } from "antd";
import SVG from "react-svg";
import Logo from "../../public/img/logo.png";
import Icons from "./Icons";
import TypeIcon from "./TypeIcon";
import _ from "underscore";
const { Meta } = Card;

const Revision = rev => (
  <span>
    <Icon type="edit" />{' '}<span>{rev}</span>
  </span>
);

const Name = instance => {
  let name =
    instance["skos:prefLabel"] ||
    instance["rdfs:label"] ||
    instance["schema:name"] ||
    instance["name"];
  let id = instance["@id"];
  if (!name) {
    let split = id.split("-");
    name = "..." + split[split.length - 1];
  }
  return (
    <div className="name">
      {name} <CopyToClipboard value={id} text="copy identifier" />
    </div>
  );
};

const Deprecated = deprecated => (
  <div className="deprecated">
    {deprecated ? (
      <small style={{ color: "#ff666680" }}>
        <Icon type="exclamation" /> Deprecated
      </small>
    ) : null}
  </div>
);

const GridResult = ({ value, goToEntityByID, openVisualizer}) => {
  let { distribution } = value;
  let cover = null;
  let files

  if (distribution) {
    files = distribution
      .filter(distro => distro.mediaType !== "image/png" )
      .map(distro => {
        return distro
    })
  }
  if (
    distribution &&
    distribution[0] &&
    distribution[0].mediaType === "image/png" &&
    distribution[0].downloadURL
  ) {
    cover = (
      <img
        style={{ width: '100%', height: '100%' }}
        alt="example"
        src={distribution[0].downloadURL}
      />
    );
  }
  return (
    <WithStore
      mapStateToProps={({ types }) => ({
        hoverType: types.hoverType,
        types: types.types
      })}
      mapDispatchToProps={{}}
    >{({ hoverType, types }) => {
      const mostRelevantType = Array.isArray(value['@type']) ?
        value['@type'][value['@type'].length - 1] :
        value['@type'];
      const typeArray = Array.isArray(value['@type']) ?
        value['@type'] :
        [value['@type']];
      const myType = _.find(types, type => {
        return type.value === mostRelevantType
      });
      return (
        <div className="result-card" style={myType && {borderTop: `1px solid ${myType.color}`}}>
      <div className="result-card-hover">
        <div className="bookmark">
          <Icon type="book" /> Save For Later
        </div>
        <div>
          <div className="btn-wrapper">
            <button className="emphasized" onClick={() => goToEntityByID(value['@id'])}>
            <SVG
                path={Icons.preview}
                svgClassName="svg-explorer"
                className="preview"
              /><span>Open Preview</span>
            </button>
          </div>
          <div className="btn-wrapper">
            <button onClick={() => openVisualizer()}>
              <SVG
                path={Icons.eye}
                svgClassName="svg-explorer"
                className="visualizer"
              />
              <span>Visualizer</span>
            </button>
          </div>
        </div>
        <div className="star">
          <Icon type="star" /> Follow Me
        </div>
      </div>
      <div className="image-preview">{cover}</div>
      <div className="type-avatar">{myType && <TypeIcon color={myType.color} iconURL={myType.icon}/>}
      </div>
      <div className="card-title">
        <div className="name ellipsis">{value.name}</div>
        <div className="date"><Icon type="calendar"/>{' '}03/13/2018</div>
      </div>
      <div className="card-description">
        <p className="p-ellipsis">{value.description}</p>
      </div>
      {/* <div className="card-tag">
        <Shapes.Type type={value["@type"]} />
      </div> */}
      <div className="card-footer flex">
        <div>
            {files && files.length > 0 &&
            <div>
              <Icon type="folder"/> {files.length}
            </div>
          }
        </div>
        <div>
          <div className="rev">{Revision(value["nxv:rev"])}</div>
          <div className="dep">{Deprecated(value["nxv:deprecated"])}</div>
        </div>
      </div>
    </div>
      );
    }}
    </WithStore>
  );
};

export default GridResult;
