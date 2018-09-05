import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "antd";
import fetchProtectedData from "../../libs/fetchProtectedData";

const DownloadButtonComponent = (status, handleClick) => {
  let content = {
    props: {
      className: "download"
    },
    content: "Download"
  }
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
    <Button {...content.props} onClick={handleClick}>
      {content.content}
    </Button>
  )
}

class DownloadButtonContainer extends React.Component {
  state = {
    status: "ready",
  }

  handleDownload = async () => {
    this.setState({
      status: "pending"
    });
    const { fileURL: url, token, fileName } = this.props;
    try {
      let base64 = await fetchProtectedData.asBase64(url, token);
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = base64;
      link.setAttribute('type', 'hidden');
      link.setAttribute('download', fileName);
      link.click();
      this.setState({
        status: "fulfilled"
      });
    } catch(error) {
      this.setState({
        status: "failed"
      });
    }
  }

  render() {
    const { status } = this.state;
    return DownloadButtonComponent(status, this.handleDownload)
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

DownloadButtonContainer.propTypes = {
  fileName: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  fileURL: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
)(DownloadButtonContainer);
