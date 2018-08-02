import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

class InspectLink extends PureComponent {
  render() {
    const { id } = this.props;
    return (
      <Link
        key={id}
        to={{
          pathname: `/docs/${id}`,
          state: { modal: true }
        }}>Inspect</Link>
    );
  }
}

export default InspectLink;