import React, { PureComponent } from "react";
import MorphologyViewer from "../../MorphologyViewer";
import SVG from "react-svg";
import icons from "../../Icons";
import { getDistributionFromInstance } from "@client/libs/distributions";
import { getProp } from "@libs/utils";
import WithNexusInstance from "../../WithNexusInstance";

class MorphologyPreview extends PureComponent {
  handleOnHover(hovering) {
    if (this.props.onHover) {
      return this.props.onHover(hovering);
    }
  }
  render() {
    let { value, shouldRender } = this.props;
    const divStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    };
    let previewInstanceID = "https://bbp.epfl.ch/nexus/v0/data/bbp/core/entity/v0.1.0/d8ff3f80-8307-4704-9307-9f9041370e24" // getDistributionFromInstance(getProp(value, "morphology"));
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <WithNexusInstance
          instanceID={previewInstanceID}
          render={({ instance }) => {
            const morphologySrc = getDistributionFromInstance(instance);
            return (
              <div className="fade-in" style={divStyle}>
                {instance && morphologySrc && (
                  <div
                    style={{ width: "100%", height: "100%" }}
                    onMouseLeave={() => this.handleOnHover(false)}
                    onMouseEnter={() => this.handleOnHover(true)}
                  >
                    <MorphologyViewer
                      morphologySrc={morphologySrc}
                      shouldRender={shouldRender}
                    />
                  </div>
                )}
                {!instance && !morphologySrc && (
                  <div
                    style={{
                      width: "6em",
                      margin: "0 auto",
                      marginTop: "10em"
                    }}
                  >
                    <SVG
                      path={icons.neuron}
                      svgClassName="neuron-svg"
                      className="neuron-icon"
                    />
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default MorphologyPreview;
