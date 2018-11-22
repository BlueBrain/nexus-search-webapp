import React from "react";
import PropTypes from "prop-types";
import icons from "./Icons";
import SVG from "react-svg";

const DEFAULT_TYPE_ICON_KEY = "cube";

const TypeIcon = ({ iconURL, color, className }) => (
  <SVG
    svgStyle={color ? { fill: color } : {}}
    path={icons[iconURL] || icons[DEFAULT_TYPE_ICON_KEY]}
    svgClassName={"type-svg"}
    className={className || "type-svg"}
  />
);

TypeIcon.propTypes = {
  iconURL: PropTypes.string,
  color: PropTypes.string
};

export default TypeIcon;
