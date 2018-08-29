import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Icon, Modal, List, Button } from "antd";
import prettyBytes from "pretty-bytes";
import { getProp } from "@libs/utils";
import DownloadButton from "./DownloadButton";
import DownloadAllButton from "./DownloadAllButton";

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
    const { children, files, name } = this.props;
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div className="downloader">
        <div className="downloader-clicker"onClick={this.showModal}>{children}</div>
        <Modal
          title={`Associated files for ${name}`}
          visible={visible}
          onOk={this.handleOk}
          centered
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <DownloadAllButton files={files} name={name} />
          ]}
        >
          <div className="download-list">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={files}
              renderItem={item => (
                <List.Item
                  actions={[
                    <DownloadButton
                      fileName={getProp(item, "originalFileName")}
                      fileURL={getProp(item, "downloadURL")}
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Icon type="file-text" />}
                    title={<span>{item.originalFileName}</span>}
                    description={
                      <div className="flex">
                        <div>{getProp(item, "mediaType")}</div>
                        <div>
                          {prettyBytes(getProp(item, "contentSize.value"))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    token: auth.token
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     close: bindActionCreators(lightbox.lightboxClose, dispatch)
//   };
// }

DownloadContainer.propTypes = {
  name: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  files: PropTypes.any.isRequired
};

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(DownloadContainer);
