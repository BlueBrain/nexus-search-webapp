import React from "react";
import { connect } from "react-redux";
import { getProp } from "@libs/utils";
import InspectLink from "../../Cards/Cell/InspectLink";

const ProvLinkComponent = ({ entity , status, searchId }) => {
  console.log(entity, searchId, status)
  return (
    <InspectLink id={searchId}>{searchId}</InspectLink>
  )
}


class ProvLinkContainer extends React.PureComponent {
  state = { status: "pending", entity: null }
  componentDidMount () {
    const { searchId } = this.props;
    this.fetchEntity(searchId)
  }
  fetchEntity() {

  }
  render() {
    const { entity, status } = this.state;
    const { searchId } = this.props;
    console.log(this.props)
    return ProvLinkComponent({ entity, status, searchId })
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

export default connect(mapStateToProps)(ProvLinkContainer);
