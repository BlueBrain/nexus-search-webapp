import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Icon, Modal, List, Button } from "antd";
import prettyBytes from "pretty-bytes";
import { getProp } from "@libs/utils";
import { compact } from "underscore";
import DownloadButton from "./DownloadButton";
import DownloadAllButton from "./DownloadAllButton";
import CopyToClipboard from "../CopyToClipboard";

class DownloadContainer extends React.Component {
  state = {
    visible: false,
    confirmLoading: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    let { children, files, name } = this.props;
    files = compact(files);
    const { visible, confirmLoading, ModalText } = this.state;
    const isGPFS = !!files.filter(entry => {
      let hasGPFS = (getProp(entry, "downloadURL", "").indexOf("gpfs") >= 0);
      return hasGPFS
    }).length;
    const footer = footerComponent(isGPFS, files, name, this.handleCancel);
    return (
      <div className="downloader">
        <div className="downloader-clicker" onClick={this.showModal}>{children}</div>
        <Modal
          title={`Associated files for ${name}`}
          visible={visible}
          onOk={this.handleOk}
          centered
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={footer}
        >
          <div className="download-list">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={files}
              renderItem={item => listComponent(isGPFS, item)}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

function footerComponent(isGPFS, files, name, handleCancel) {
  // GPFS files cannot be downloaded via browser
  if (isGPFS) {
    return [
      <Button key="back" onClick={handleCancel}>
        Cancel
      </Button>
    ];
  }
  return [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <DownloadAllButton files={files} name={name} />
  ];
}

function listComponent(isGPFS, item) {
  // GPFS files cannot be downloaded via browser
  if (isGPFS) {
    return (
      <List.Item
      actions={[
        <CopyToClipboard value={getProp(item, "downloadURL")}>
          <span>Copy Location</span>
        </CopyToClipboard>
      ]}
    >
      <List.Item.Meta
        avatar={<Icon type="file-text" />}
        title={<span>{getProp(item, "downloadURL").split("/").pop()}</span>}
        description={
          <div className="flex">
            <span>GPFS storage</span>
            <div>{getProp(item, "mediaType")}</div>
            <div>
              {getProp(item, "contentSize.value") && prettyBytes(getProp(item, "contentSize.value"))}
            </div>
          </div>
        }
      />
    </List.Item>
    )
  }
  return (
    <List.Item
      actions={[
        <DownloadButton
          fileName={getProp(item, "originalFileName", "unnamed")}
          fileURL={getProp(item, "downloadURL")}
        />
      ]}
    >
      <List.Item.Meta
        avatar={<Icon type="file-text" />}
        title={<span>{getProp(item, "originalFileName", "unnamed")}</span>}
        description={
          <div className="flex">
            <div>{getProp(item, "mediaType")}</div>
            <div>
              {getProp(item, "contentSize.value") && prettyBytes(getProp(item, "contentSize.value"))}
            </div>
          </div>
        }
      />
    </List.Item>
  );
}

  function mapStateToProps({ auth }) {
    return {
      token: auth.token
    };
  }

  DownloadContainer.propTypes = {
    name: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    files: PropTypes.any.isRequired
  };

  export default connect(
    mapStateToProps
    // mapDispatchToProps
  )(DownloadContainer);
