import React from "react";
import { Icon, Button } from "antd";
import SVG from "react-svg";
import icons from "./../../../Icons";

const GettingStarted = ({ onDismiss }) => {
  return (
    <div className="info-box">
      <a className="close" onClick={onDismiss}>
        <Icon type="close" />
      </a>
      <div className="flex space-between">
        <div style={{ width: "5em", marginRight: "1em"}}>
          <SVG
            path={icons.lightbulb}
            svgClassName="idea-svg"
            className="idea-icon"
          />
        </div>
        <div className="grow">
          <h1>Why, hello there!</h1>
          <p>I'm an example of an info-box. These are places you can use to make curated filter-sets or other highlights</p>
          <Button onClick={onDismiss}>Got it.</Button>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
