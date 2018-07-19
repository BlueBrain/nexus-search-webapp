import React from "react";
import { WithStore } from "@bbp/nexus-react";
import TypeIcon from "../TypeIcon";
import FontAwesome from "react-fontawesome";
import _ from "underscore";
import MorphologyViewer from "../MorphologyViewer";
import fakeMorphology from "../../../public/img/fakeMorpho.png";
import ephysSummary from "../../../public/img/ephys_summary.png";
import Perspectivizer from "../Animations/Perspectivizer";
import { has } from "underscore";
import { Transition, animated } from "react-spring";

// const MorphoMe = ({ hovered }) => {
//   const divStyle = {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%", height: "100%",
//   }
//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <Transition
//         from={{ opacity: 0 }}
//         enter={{ opacity: 1 }}
//         leave={{ opacity: 0, pointerEvents: "none" }}
//       >
//         {
//             hovered ?
//             style => <div style={{ ...style, ...divStyle }}><MorphologyViewer /></div>
//             :
//             style => <div style={{ ...style, ...divStyle }}><img src={fakeMorphology} style={{ width: "100%", height: "100%" }} /></div>
//         }
//       </Transition>
//     </div>
//   );
// };

const MorphoMe = ({ hovered }) => {
  const divStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", height: "100%",
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
        {
            hovered ?
            <div style={divStyle}><MorphologyViewer /></div>
            :
            <div style={divStyle}><img src={fakeMorphology} style={{ width: "100%", height: "100%" }} /></div>
        }
    </div>
  );
};

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
          <Perspectivizer>
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
                  <div className="labels">
                    <div className="top-label">Rattus norvegicus</div>
                    <div className="bottom-label">Wister Han</div>
                  </div>
                </div>
                <div className="name">{value.cellName.label}</div>
              </div>
              <div className="card-morph">
                <div className="ephys" style={{zIndex: 1}}>
                  <img src={ephysSummary} />
                </div>
                <MorphoMe hovered={active} />
              </div>
              <div className="footer">
                <div className="mType">
                  {has(value, "mType.label") && value.mType.label}
                </div>
                <div className="brainRegion">{value.brainRegion.label}</div>
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
            )}
          </Perspectivizer>
        );
      }}
    </WithStore>
  );
};

export default GridResult;
