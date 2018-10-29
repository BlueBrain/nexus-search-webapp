import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { syncs } from "../../store/actions";
import SyncListComponent from "./SyncListComponent";

class SyncListContainer extends PureComponent {
  componentDidMount() {
    console.log("sync list container mounted")
    this.props.fetchSyncEvents();
  }
  render() {
    return (
      <SyncListComponent
        {...this.props}
      />
    );
  }
}

SyncListContainer.propTypes = {
  pending: PropTypes.bool.isRequired,
  data: PropTypes.any,
  error: PropTypes.any,
};

function mapStateToProps({ syncs, config }) {
  return {
    ...syncs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSyncEvents: bindActionCreators(syncs.fetchSyncEvents, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncListContainer);
