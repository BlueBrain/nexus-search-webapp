import React, { Fragment } from "react";
import { WithStore } from "@bbp/nexus-react";
import TypeIcon from "../../TypeIcon";
import { find } from "underscore";
import Perspectivizer from "../../Animations/Perspectivizer";
import { getProp } from "@libs/utils";
import InspectLink from "./InspectLink";
import Contributions from "./Contributions";
import { Icon } from "antd";
import Download from "../../Download";

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
        const studyType = getProp(value, "studyType.label");
        const isInSilico = studyType === "In Silico";
        return (
          <Perspectivizer disabled>
            {({ active }) => (
              <div
              className="result-card"
              style={myType && { borderTop: `1px solid ${myType.color}` }}
            >
              <div className="header">
                <div className="top flex">
                <InspectLink id={value["searchID"]}>
                  <div className="type-avatar">
                    {myType && (
                        <TypeIcon color={myType.color} iconURL={myType.icon} />
                    )}
                  </div>
                  </InspectLink>
                  <div className={`action-buttons ${active ? "active" : ""}`}>
                    <Download files={getProp(value, "files")} name={getProp(value, "cellName.label", "Cell")}>
                      <a><Icon type="cloud-download-o" style={{ fontSize: 16 }}/></a>
                    </Download>
                  </div>
                  <div className="labels">
                    {value.subject &&
                      <Fragment>
                        <div className="top-label">{getProp(value, "subject.species")}</div>
                        <div className="bottom-label">{getProp(value, "subject.strain")}</div>
                      </Fragment>
                    }
                  </div>
                </div>
                <div className="name">{value.name}</div>
              </div>
              <div className="footer">
                <div className="brainRegion">{getProp(value, "brainRegion.label")}</div>
                <div className="bottom flex space-between">
                  <Contributions contributions={getProp(value, "contributions")} />
                  {isInSilico &&
                    <div className="banner in-silico"></div>
                  }
                  {!isInSilico &&
                    <div className="banner experimental"></div>
                  }
                  <div className="unemphasized study-type">{studyType === "Experimental" ? "Exper." : studyType}</div>
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
