import React from "react";
import { connect } from "react-redux";
import { getProp } from "@libs/utils";
import InspectLink from "../../Cards/Cell/InspectLink";



class ProvLinkContainer extends React.PureComponent {
  render() {
    const { searchId } = this.props;
    return <InspectLink id={searchId}>{searchId}</InspectLink>
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

export default connect(mapStateToProps)(ProvLinkContainer);
