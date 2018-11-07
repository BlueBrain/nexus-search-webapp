import React, { PureComponent, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Websocket from 'react-websocket';
import { syncs } from "../../store/actions";
import SyncListComponent from "./SyncListComponent";

class SyncListContainer extends PureComponent {
  componentDidMount() {
    this.props.fetchSyncEvents();
  }
  handleData (data) {
    let response = JSON.parse(data);
    this.props.fetchSyncEvents();
  }
  render() {
    let { apiURL } = this.props;
    apiURL = apiURL.replace("https://", "wss://").replace("http://", "ws://");
    return (
      <Fragment>
        <Websocket url={`${apiURL}/search/syncs/updates/`}
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
    apiURL: config.elasticSearchAPI,
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
