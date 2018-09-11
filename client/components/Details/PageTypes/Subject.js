import React, { PureComponent } from "react";
import SVG from "react-svg";
import { getProp } from "@libs/utils";
import icons from "../../Icons";

class SubjectComponent extends PureComponent {
  render() {
    const { subject } = this.props;
    return (
      <div className="subject">
        <div className="top-label">
          <SVG
            path={icons.mouse}
            svgClassName="subjectsvg"
            className="subject-icon"
          />{" "}
          {getProp(subject, "species")}
        </div>
        <div className="bottom-label">
          {getProp(subject, "strain")}
        </div>
      </div>
    );
  }
}

export default SubjectComponent;
