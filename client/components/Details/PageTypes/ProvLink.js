import React from "react";
import { connect } from "react-redux";
import { getProp } from "@libs/utils";
import InspectLink from "../../Cards/Cell/InspectLink";

const ProvLinkComponent = ({ entity , status, searchId, name }) => {
  return (
    <InspectLink id={searchId}>{name || searchId}</InspectLink>
  )
}


class ProvLinkContainer extends React.PureComponent {
  state = { status: "pending", entity: null }
  componentDidMount () {
    const { searchId, name } = this.props;
    this.fetchEntity(searchId)
  }
  fetchEntity() {

  }
  render() {
    const { entity, status } = this.state;
    const { searchId, name } = this.props;
    return ProvLinkComponent({ entity, status, searchId, name })
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

export default connect(mapStateToProps)(ProvLinkContainer);
