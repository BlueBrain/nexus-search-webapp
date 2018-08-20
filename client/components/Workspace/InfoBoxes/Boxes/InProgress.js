import React from "react";
import { Icon, Button } from "antd";
import SVG from "react-svg";
import icons from "./../../../Icons";

const inProgress = ({ onDismiss }) => {
  return (
    <div className="info-box">
      <a className="close" onClick={onDismiss}>
        <Icon type="close" />
      </a>
      <div className="flex space-between">
        <div style={{ width: "4em", marginRight: "2em"}}>
          <SVG
            path={icons.bug}
            svgClassName="idea-svg"
            className="idea-icon"
          />
        </div>
        <div className="grow">
          <h3>Development in progress!</h3>
          <p>this application and the datasets you can find here are a work in progress. Some information and features may be missing, and some datasets are probably inaccurate.</p>
          <Button onClick={onDismiss}>Thanks.</Button>
        </div>
      </div>
    </div>
  );
};

export default inProgress;
