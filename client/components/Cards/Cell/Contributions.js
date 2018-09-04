import React, { Fragment } from "react";
import FontAwesome from "react-fontawesome";
import { getProp } from "@libs/utils";

function getPIName (contributions) {
  let PI = contributions[0] || {};
  let name =  getProp(PI, "fullName") ?
    getProp(PI, "fullName") :
    getProp(PI, "givenName") +
    " " +
    getProp(PI, "familyName");
  return name;
}

function Contributions({ contributions }) {
  return (
    <div>
      {contributions && (
        <Fragment>
          <FontAwesome name={"user"} />{" "}
          <span className="pi">{getPIName(contributions)}</span>
          {contributions.length > 1 && (
            <span> + {contributions.length - 1} more</span>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default Contributions;
