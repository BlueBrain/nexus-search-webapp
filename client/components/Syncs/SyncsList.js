import React, { PureComponent, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Websocket from 'react-websocket';
import { syncs } from "../../store/actions";
import SyncListComponent from "./SyncListComponent";

class SyncListContainer extends PureComponent {
  componentDidMount() {
    console.log("sync list container mounted")
    this.props.fetchSyncEvents();
  }
  handleData (data) {
    let response = JSON.parse(data);
    console.log(response);
    this.props.fetchSyncEvents();
  }
  render() {
    return (
      <Fragment>
        <Websocket url='ws://localhost:9999/search/syncs/updates/'
                onMessage={this.handleData.bind(this)}/>
        <SyncListComponent
          {...this.props}
        />
      </Fragment>
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
