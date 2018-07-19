import React from "react";
import SVG from "react-svg";
import icons from "./../../Icons";


const description = <div>
  <p style={{fontSize: "1em"}}>We're sorry, but this seems to be an error! If this isn't the first time you have seen this, consider letting us know.</p>
  <a target="_blank" href="https://github.com/BlueBrain/nexus-search-webapp/issues/new">post an issue to github</a>
</div>

const connectionError = {
  message: "Something went when reaching out to the backend.",
  description,
  icon: <div style={{ width: "2em", marginRight: "1em"}}>
  <SVG
    path={icons.bug}
    svgClassName="notification-svg error"
  />
</div>,
}

const somethingWentWrongError = {
  message: "Oh no! Something went wrong.",
  description,
  icon: <div style={{ width: "2em", marginRight: "1em"}}>
  <SVG
    path={icons.bug}
    svgClassName="notification-svg error"
  />
</div>,
}

export default {
  connectionError,
  somethingWentWrongError
}