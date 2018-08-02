import React, { PureComponent } from "react";
import MorphologyViewer from "../../MorphologyViewer";
import SVG from "react-svg";
import icons from "../../Icons";

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
    let morphologySrc;
    if (
      value.morphology &&
      value.morphology.distribution &&
      value.morphology.distribution.fileName
    ) {
      morphologySrc = value.morphology.distribution.fileName;
    }

    return (
      <div style={{ width: "100%", height: "100%" }}>
        {
          <div className="fade-in" style={divStyle}>
            {morphologySrc && (
              <div
              style={{ width: "100%", height: "100%" }}
                onMouseLeave={() => this.handleOnHover(false)}
                onMouseEnter={() => this.handleOnHover(true)}
              >
                <MorphologyViewer morphologySrc={morphologySrc} shouldRender={shouldRender}/>
              </div>
            )}
            {!morphologySrc && (
              <div
                style={{ width: "6em", margin: "0 auto", marginTop: "10em" }}
              >
                <SVG
                  path={icons.neuron}
                  svgClassName="neuron-svg"
                  className="neuron-icon"
                />
              </div>
            )}
          </div>
        }
      </div>
    );
  }
}

export default MorphologyPreview;
