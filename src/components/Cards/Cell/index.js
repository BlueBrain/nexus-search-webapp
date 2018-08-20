import React, { Fragment } from "react";
import { WithStore } from "@bbp/nexus-react";
import TypeIcon from "../../TypeIcon";
import { find } from "underscore";
import Perspectivizer from "../../Animations/Perspectivizer";
import { getProp } from "../../../libs/utils";
import Preview from "./Preview";
import InspectLink from "./InspectLink";
import Contributions from "./Contributions";
import { Icon } from "antd";

function DownloadLink ({ url, children }) {
  if (url) {
    return (
      <a href={url} download>
        {children}
      </a>
    );
  } else {
    return null
  }
}

const GridResult = ({ value, id }) => {
  return (
    <WithStore
      mapStateToProps={({ types }) => ({
        hoverType: types.hoverType,
        types: types.types
      })}
      mapDispatchToProps={{}}
    >
      {({ hoverType, types }) => {
        const mostRelevantType = Array.isArray(value["@type"])
          ? value["@type"][value["@type"].length - 1]
          : value["@type"];
        const typeArray = Array.isArray(value["@type"])
          ? value["@type"]
          : [value["@type"]];
        const myType = find(types, type => {
          return type.value === mostRelevantType;
        });
        return (
          <Perspectivizer disabled>
            {({ active }) => (
              <div
              className="result-card"
              style={myType && { borderTop: `1px solid ${myType.color}` }}
            >
              <div className="header">
                <div className="top flex">
                  <div className="type-avatar">
                    {myType && (
                      <TypeIcon color={myType.color} iconURL={myType.icon} />
                    )}
                  </div>
                  <div className={`action-buttons ${active ? "active" : ""}`}>
                    {
                      // TODO change this ID when nexus links are resolvable
                    }
                    <InspectLink id={value["_id"]}>
                      <Icon type="eye-o" style={{ fontSize: 16 }}/>
                    </InspectLink>
                    <DownloadLink url={getProp(value, "distribution.url")}>
                      <Icon type="cloud-download-o" style={{ fontSize: 16 }}/>
                    </DownloadLink>
                  </div>
                  <div className="labels">
                    {value.subject &&
                      <Fragment>
                        <div className="top-label">{value.subject.species.label}</div>
                        <div className="bottom-label">{value.subject.strain.label}</div>
                      </Fragment>
                    }
                  </div>
                </div>
                <div className="name">{value.cellName.label}</div>
              </div>
              <Preview value={value}/>
              <div className="footer">
                <div className="mType">
                  {getProp(value, "mType.label") && value.mType.label}
                </div>
                <div className="brainRegion">{getProp(value, "brainRegion.label")}</div>
                <div className="eType">{getProp(value, "eType.label")}</div>
                <div className="bottom flex space-between">
                  <Contributions contributions={getProp(value, "contributions")} />
                  <div className="unemphasized">Experimental</div>
                </div>
              </div>
            </div>
            )}
          </Perspectivizer>
        );
      }}
    </WithStore>
  );
};

export default GridResult;
