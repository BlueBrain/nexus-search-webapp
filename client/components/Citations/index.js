import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Icon, Modal, List, Button } from "antd";
import { getProp } from "@libs/utils";
import CopyToClipboard from "../CopyToClipboard";

class CitationsContainer extends React.Component {
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
    let { children, citations, name } = this.props;
    const { visible, confirmLoading, ModalText } = this.state;

    return (
      <div className="downloader">
        <div className="downloader-clicker" onClick={this.showModal}>{children}</div>
        <Modal
          title={`How to cite ${name}?`}
          visible={visible}
          onOk={this.handleOk}
          centered
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          ]}
        >
          {citationsList(citations)}
        </Modal>
      </div>
    );
  }
}

export const citationsList = function (citations) {
  return (
    <div className="citations-list">
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={getProp(citations, "citationsList")}
        renderItem={item => citationsComponent(item)}
      />
      {getProp(citations, "howToCite") &&
        <a target="_blank" href={getProp(citations, "howToCite")}><Icon type="highlight" style={{ fontSize: 16 }}/>{" "}How do I cite these materials?</a>
      }
    </div>
  )
}

function citationsComponent(citation) {
  let text = getProp(citation, "text");
  let location = getProp(citation, "location")
  return (
    <li>
      {text &&
        <p>
          {text}
        </p>
      }
      {location &&
        <a href={location} target="_blank">{location}</a>
      }
    </li>
  )
}

CitationsContainer.propTypes = {
  citations: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired
};

export default CitationsContainer;
