import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

class InspectLink extends PureComponent {
  render() {
    const { id, children } = this.props;
    return (
      <Link
        key={id}
        to={{
          pathname: `/docs/${id}`,
          state: { modal: true }
        }}>{children}</Link>
    );
  }
}

export default InspectLink;