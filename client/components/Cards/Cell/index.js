import React, { Fragment } from "react";
import { WithStore } from "@bbp/nexus-react";
import TypeIcon from "../../TypeIcon";
import { find } from "underscore";
import Perspectivizer from "../../Animations/Perspectivizer";
import { getProp } from "@libs/utils";
import Preview from "./Preview";
import InspectLink from "../InspectLink";
import Contributions from "./Contributions";
import { Icon } from "antd";
import Download from "../../Download";
import Citations from "../../Citations";
import { eTypes, mTypes } from "../../../../consts";
import { hasMorphology, hasElectrophysiology } from "../../DataTypeIcons";

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
        const studyType = getProp(value, "studyType.name");
        const isInSilico = studyType === "In Silico";
        let dataTypesList = [];
        if (getProp(value, "dataType.morphology") === "has morphology") {
          dataTypesList.push(<li>{hasMorphology()}</li>);
        }
        if (
          getProp(value, "dataType.electrophysiology") ===
          "has electrophysiology"
        ) {
          dataTypesList.push(<li>{hasElectrophysiology()}</li>);
        }
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
                          <TypeIcon
                            color={myType.color}
                            iconURL={myType.icon}
                          />
                        )}
                      </div>
                    </InspectLink>
                    <div className={`action-buttons ${active ? "active" : ""}`}>
                      {getProp(value, "files") &&
                        !!getProp(value, "files").length && (
                          <Download
                            files={getProp(value, "files")}
                            name={getProp(value, "cellName.label", "Cell")}
                          >
                            <a>
                              <Icon
                                type="cloud-download-o"
                                style={{ fontSize: 16 }}
                              />{" "}
                              Downloads
                            </a>
                          </Download>
                        )}
                      {getProp(value, "citations") && (
                        <Citations
                          citations={getProp(value, "citations")}
                          name={getProp(value, "cellName.label", "Cell")}
                        >
                          <a>
                            <Icon type="highlight" style={{ fontSize: 16 }} />{" "}
                            How to Cite?
                          </a>
                        </Citations>
                      )}
                    </div>
                    <div className="labels">
                      {value.subject && (
                        <Fragment>
                          <div className="top-label">
                            {getProp(value, "subject.species")}
                          </div>
                          <div className="bottom-label">
                            {getProp(value, "subject.strain")}
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                  <div className="name">{getProp(value, "cellName.label")}</div>
                </div>
                <Preview value={value} />
                <div className="footer">
                  <div className="data-types">
                    <ul>{dataTypesList}</ul>
                  </div>
                  <div className="mType">
                    {getProp(value, "cellType.mType")}
                  </div>
                  <div className="brainRegion">
                    {getProp(value, "brainLocation.brainRegion")}
                  </div>
                  <div className="eType">
                    {getProp(value, "cellType.eType") &&
                      eTypes[getProp(value, "eType.label")]}
                  </div>
                  <div className="bottom flex space-between">
                    <Contributions
                      contributions={getProp(value, "contribution")}
                    />
                    {isInSilico && <div className="banner in-silico" />}
                    {!isInSilico && <div className="banner experimental" />}
                    <div className="unemphasized study-type">
                      {studyType === "Experimental" ? "Exper." : studyType}
                    </div>
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
