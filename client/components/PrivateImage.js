import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import fetchProtectedData from "../libs/fetchProtectedData";

class PrivateImage extends PureComponent {
  state = { base64: null }
  componentDidMount () {
    this.fetchImage();
  }

  componentDidUpdate() {
    this.fetchImage();
  }

  async fetchImage () {
    let { src, token } = this.props;
    let base64 = await fetchProtectedData.asBase64(src, token);
    if (base64) {
      this.setState({ base64 });
    }
  }

  render() {
    const { base64 } = this.state;
    let className = this.props.makeClassName ? this.props.makeClassName(!!base64) : "";
    return base64 ? <img className={className} src={base64}/> : null;
  }
}

PrivateImage.propTypes = {
  token: PropTypes.string,
  src: PropTypes.string.isRequired,
  makeClassName: PropTypes.func
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
)(PrivateImage);
