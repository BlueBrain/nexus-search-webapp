import React, { PureComponent } from "react";
import { Modal } from "antd";

function WithModal(Component) {
  return class WithModalContainer extends PureComponent {
    state = { visible: true };
    handleCancel = () => {
      this.setState({ visible: false });
      this.props.onCancel();
    };
    render() {
      const { visible } = this.state;
      return (
        <Modal
          width={960}
          bodyStyle={{
            minWidth: "980px"
          }}
          style={{ top: 20 }}
          title={this.props.title}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div style={{ backgroundColor: "#f4f4f4" }}>
            <Component ref={this.setChildRef} {...this.props} />
          </div>
        </Modal>
      );
    }
  };
}

export default WithModal;
