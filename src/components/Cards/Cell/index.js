import React, { Fragment } from "react";
import { bindActionCreators } from "redux";
import { WithStore } from "@bbp/nexus-react";
import TypeIcon from "../../TypeIcon";
import FontAwesome from "react-fontawesome";
import _ from "underscore";
import Perspectivizer from "../../Animations/Perspectivizer";
import { has } from "underscore";
import Preview from "./Preview";
import InspectLink from "./InspectLink";

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
        const myType = _.find(types, type => {
          return type.value === mostRelevantType;
        });
        return (
          <Perspectivizer>
            {({ active }) => (
              <div
              className="result-card"
              style={myType && { borderTop: `1px solid ${myType.color}` }}
            >
              <div className="header">
                <InspectLink id={id} />
                <div className="top flex">
                  <div className="type-avatar">
                    {myType && (
                      <TypeIcon color={myType.color} iconURL={myType.icon} />
                    )}
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
                  {has(value, "mType.label") && value.mType.label}
                </div>
                <div className="brainRegion">{value.brainRegion.label}</div>
                <div className="eType">{value.eType.label}</div>
                <div className="bottom flex space-between">
                  <div>
                    {has(value, "contributions") && (
                      <React.Fragment>
                        <FontAwesome name={"user"} />{" "}
                        <span className="pi">
                          {value.contributions[0].fullName}
                        </span>
                        {value.contributions.length > 1 && <span>{" "}+ {value.contributions.length -1} more</span>}
                      </React.Fragment>
                    )}
                  </div>
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
