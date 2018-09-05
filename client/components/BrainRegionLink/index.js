import React, { PureComponent } from "react";
import SVG from "react-svg";
import icons from "../Icons";

function formRegionLink(region) {
  let regionID = 793;
  // TODO get brain region atlas mappings
  return "https://bbp.epfl.ch/nexus/cell-atlas/?regions=" + regionID;
}

class BrainRegionLink extends PureComponent {
  render() {
    const { region, species } = this.props;
    // TODO fit for species
    if (species === "mouse") {
      return (
        <a
          className="brain-region"
          target="_blank"
          href={formRegionLink(region)}
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
      return (<a className="brain-region" disabled>
        <SVG
          path={icons.brain}
          svgClassName="brain-region-svg"
          className="brain-region-icon"
        />{" "}
        <em>{region}</em>
      </a>);
    }
  }
}

export default BrainRegionLink;
