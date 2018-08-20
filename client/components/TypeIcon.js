import React from "react";
import PropTypes from "prop-types";
import icons from "./Icons";
import SVG from "react-svg";

const DEFAULT_TYPE_ICON_KEY = "cube";

const TypeIcon = ({iconURL, color}) => (
  <SVG
    svgStyle={color ?  { fill: color } : {}}
    path={icons[iconURL] || icons[DEFAULT_TYPE_ICON_KEY]}
    svgClassName="type-svg"
    className="type-icon"
  />
);

TypeIcon.propTypes = {
  iconURL: PropTypes.string,
  color: PropTypes.string.isRequired,
};

export default TypeIcon;