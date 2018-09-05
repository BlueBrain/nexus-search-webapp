import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchWithToken } from "@bbp/nexus-js-helpers";

class WithNexusInstance extends PureComponent {
  state = { instance: null }
  componentDidMount () {
    this.fetchInstance();
  }

  async fetchInstance () {
    let { instanceID, token } = this.props;
    let response = await fetchWithToken(instanceID, token);
    if (!response) { return; }
    let instance = await response.json();
    if (instance) {
      this.setState({ instance });
    }
  }

  render() {
    const { instance } = this.state;
    if (instance) {
      return this.props.render({ instance })
    } else {
      return null;
    }
  }
}

WithNexusInstance.propTypes = {
  token: PropTypes.string,
  instanceID: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired
};

function mapStateToProps({ auth }) {
  const { token } = auth;
  return {
    token
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithNexusInstance);
