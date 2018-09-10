import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { isURL } from "@libs/string";

function makeSafeID(id) {
  if (isURL(id)) { return encodeURIComponent(id); }
  return id;
}

class InspectLink extends PureComponent {
  render() {
    const { id, children } = this.props;
    const safeID = makeSafeID(id);
    return (
      <Link
        key={safeID}
        to={{
          pathname: `/docs/${safeID}`,
          state: { modal: true }
        }}
      >
        {children}
      </Link>
    );
  }
}

export default InspectLink;
