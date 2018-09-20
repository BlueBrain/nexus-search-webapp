import React, { Fragment } from "react";
import FontAwesome from "react-fontawesome";
import { getProp } from "@libs/utils";

function Contributions({ contributions }) {
  const fullName = getProp(contributions[0] || {}, "fullName")
  const organization = getProp(contributions[0] || {}, "organization");
  let contrib = null;
  if (fullName) {
    contrib = (
      <Fragment>
        <FontAwesome name={"user"} />{" "}
        <span className="pi">{fullName}</span>
        {contributions.length > 1 && (
          <span> + {contributions.length - 1} more</span>
        )}
      </Fragment>
    );
  } else if (organization) {
    contrib = (
      <Fragment>
        <FontAwesome name={"university"} />{" "}
        <span className="pi">{organization}</span>
      </Fragment>
    );
  }
  return <div>{contrib}</div>;
}

export default Contributions;
