import React from "react";
import { WithStore, CopyToClipboard } from "@bbp/nexus-react";
import { Card, Icon } from "antd";
import SVG from "react-svg";
import Icons from "../Icons";
import TypeIcon from "../TypeIcon";
import FontAwesome from "react-fontawesome";
import _ from "underscore";
import MorphologyViewer from "../MorphologyViewer";
import fakeMorphology from  "../../../public/img/fakeMorpho.png";
import ephysSummary from "../../../public/img/ephys_summary.png";
import { has } from "underscore";
const GridResult = ({ value, goToEntityByID, openVisualizer }) => {
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
        const myType = _.find(types, type => {
          return type.value === mostRelevantType;
        });
        return (
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
                <div className="labels">
                  <div className="top-label">Rattus norvegicus</div>
                  <div className="bottom-label">Wister Han</div>
                </div>
              </div>
              <div className="name">
                {value.cellName.label}
              </div>
            </div>
            <div className="card-morph">
              <div className="ephys">
                <img src={ephysSummary} />
              </div>
              <img src={fakeMorphology} style={{ width: "100%", height: "100%" }} />
              {/* <MorphologyViewer /> */}
            </div>
            <div className="footer">
              <div className="mType">
                {has(value, "mType.label") && value.mType.label}
              </div>
              <div className="brainRegion">
                {value.brainRegion.label}
              </div>
              <div className="eType">{value.eType.label}</div>
              <div className="bottom flex space-between">
                <div>
                  {has(value, "value.contributions") && (
                    <React.Fragment>
                      <FontAwesome name={"user"} />{" "}
                      <span className="pi">
                        {value.contributions[0].fullName}
                      </span>
                    </React.Fragment>
                  )}
                </div>
                <div className="unemphasized">Experimental</div>
              </div>
            </div>
          </div>
        );
      }}
    </WithStore>
  );
};

export default GridResult;
