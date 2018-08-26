import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "antd";
import downloadEverything from "./downloadEverythingAsZip";

const DownloadButtonComponent = (status, handleClick) => {
  let content = {
    props: {
      className: "download"
    },
    content: "Download All"
  };
  switch (status) {
    case "pending":
      content = {
        props: {
          loading: true,
          className: "download"
        },
        content: "Preparing"
      };
      break;
    case "fulfilled":
      content = {
        props: {
          loading: false,
          icon: "check",
          className: "download"
        },
        content: "Ready"
      };
      break;
    case "fulfilled":
      content = {
        props: {
          loading: false,
          icon: "warning",
          className: "download"
        },
        content: "Failed"
      };
      break;
    default:
      break;
  }
  return (
    <Button type="primary" icon="download" {...content.props} onClick={handleClick}>
      {content.content}
    </Button>
  );
};

class DownloadButtonContainer extends React.Component {
  state = {
    status: "ready"
  };

  handleDownload = async () => {
    this.setState({
      status: "pending"
    });
    const { files, token, name } = this.props;
    try {
      await downloadEverything(files, name, token);
      this.setState({
        status: "fulfilled"
      });
    } catch (error) {
      console.error(error);
      this.setState({
        status: "failed"
      });
    }
  };

  render() {
    const { status } = this.state;
    return DownloadButtonComponent(status, this.handleDownload);
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

DownloadButtonContainer.propTypes = {
  token: PropTypes.string.isRequired,
  files: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(DownloadButtonContainer);
