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
    let morphology = getProp(value, "morphology", [{}]);
    let previewInstanceID = getProp(morphology[0] || {}, "image.@id");
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {previewInstanceID &&
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
        }
      </div>
    );
  }
}

export default MorphologyPreview;
