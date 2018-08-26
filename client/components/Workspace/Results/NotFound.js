import React from "react";
import SVG from "react-svg";
import icons from "./../../Icons";

const ResultsNotFound = () => {
  return (
    <div className="center grow full full-height column">
      <div className="no-results">
        <SVG
          path={icons.notFound}
          svgClassName="nothing-found-svg"
          className="nothing-found-icon"
        />
        <h3>No results could be found.</h3>
      </div>
    </div>
  );
};

export default ResultsNotFound;
