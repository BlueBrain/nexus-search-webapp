import React, { PureComponent } from "react";
import SVG from "react-svg";
import icons from "../Icons";
import cellAtlasBrainRegionMap from "./cellAtlasBrainRegionMap";

function formRegionLink(region) {
  // TODO make path configurable?
  let regionID = cellAtlasBrainRegionMap[region];
  return regionID ? "https://bbp.epfl.ch/nexus/cell-atlas/?regions=" + regionID : undefined;
}

class BrainRegionLink extends PureComponent {
  render() {
    const { region, species } = this.props;
    const regionLink = formRegionLink(region);
    // TODO fit for species
    if (species === "Mus musculus" && regionLink) {
      return (
        <a
          className="brain-region"
          target="_blank"
          href={regionLink}
        >
          <SVG
            path={icons.brain}
            svgClassName="brain-region-svg"
            className="brain-region-icon"
          />{" "}
          <em>{region}</em>
        </a>
      );
    } else {
      return (
        <a className="brain-region" disabled>
          <SVG
            path={icons.brain}
            svgClassName="brain-region-svg"
            className="brain-region-icon"
          />{" "}
          <em>{region}</em>
        </a>
      );
    }
  }
}

export default BrainRegionLink;
