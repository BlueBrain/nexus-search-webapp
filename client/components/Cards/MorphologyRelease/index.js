import React, { Fragment } from "react";
import { WithStore } from "@bbp/nexus-react";
import TypeIcon from "../../TypeIcon";
import { find } from "underscore";
import Perspectivizer from "../../Animations/Perspectivizer";
import { getProp } from "@libs/utils";
import InspectLink from "../InspectLink";
import Contributions from "../Cell/Contributions";
import { Icon } from "antd";
import moment from "moment";
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
        const resourceType = value["@type"];
        const mostRelevantType = Array.isArray(resourceType)
          ? resourceType.pop()
          : resourceType;
        const myType = find(types, type => {
          return type.value === mostRelevantType;
        });
        const studyType = getProp(value, "studyType.name");
        const isInSilico = studyType === "In Silico";
        let date = moment(getProp(value, "dateCreated")).format("MMM Do YYYY");
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
                      <Download
                        files={getProp(value, "files")}
                        name={getProp(value, "name", "Ion Channel")}
                      >
                        <a>
                          <Icon
                            type="cloud-download-o"
                            style={{ fontSize: 16 }}
                          />{" "}
                          Download
                        </a>
                      </Download>
                    </div>
                    <div
                      className="labels"
                      style={{
                        textAlign: "right",
                        width: "100%"
                      }}
                    >
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
                </div>
                <div
                  className="middle"
                  style={{
                    position: "absolute",
                    top: "16em",
                    padding: "1em"
                  }}
                >
                  <div
                    className="morphology-release-name"
                    style={{
                      fontSize: "2em"
                    }}
                  >
                    {value.name}
                  </div>
                </div>
                <div className="footer">
                  <div className="brainRegion">
                    {getProp(value, "brainLocation.brainRegion")}
                  </div>
                  <div>{date}</div>
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
