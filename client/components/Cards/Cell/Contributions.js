import React, { Fragment } from "react";
import FontAwesome from "react-fontawesome";

function Contributions({ contributions }) {
  return (
    <div>
      {contributions && (
        <Fragment>
          <FontAwesome name={"user"} />{" "}
          <span className="pi">{contributions[0].fullName}</span>
          {contributions.length > 1 && (
            <span> + {contributions.length - 1} more</span>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default Contributions;
