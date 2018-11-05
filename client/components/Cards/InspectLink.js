import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { makeSafeID } from "@libs/string";

class InspectLink extends PureComponent {
  render() {
    const { id, children, className } = this.props;
    const safeID = makeSafeID(id);
    return (
      // BUG!: TODO set modal to mimic pinterest routes
      <Link
        className={className}
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
