import React from "react";
import { connect } from "react-redux";
import { getProp } from "@libs/utils";
import TypeIcon from "../../NewTypeIcon";
import InspectLink from "../../Cards/Cell/InspectLink";

const ProvLinkComponent = ({ entity , status, searchId, name, type }) => {
  return (
  <InspectLink id={searchId}>{type && <TypeIcon type={type}/>} {name || searchId}</InspectLink>
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
    const { searchId, name, type } = this.props;
    return ProvLinkComponent({ entity, status, searchId, name, type })
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

export default connect(mapStateToProps)(ProvLinkContainer);
