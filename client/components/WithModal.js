import React, { PureComponent } from "react";
import { Modal } from "antd";

const DEFAULT_HEIGHT = "3000px"

function WithModal(Component) {
  return class WithModalContainer extends PureComponent {
    state = { visible: true, modalHeight: DEFAULT_HEIGHT };
    handleCancel = () => {
      this.setState({ visible: false });
      this.props.onCancel();
    };
    render() {
      const { visible, modalHeight:height } = this.state;
      return (
        <Modal
          width={960}
          bodyStyle={{
            minWidth: "980px"
          }}
          style={{ top: window.scrollY + 20, height }}
          title={this.props.title}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Component ref={this.setChildRef} {...this.props} />
        </Modal>
      );
    }
  };
}

export default WithModal;
