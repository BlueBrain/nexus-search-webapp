import React, { PureComponent } from "react";
import { Modal } from "antd";

function WithModal(Component) {
  return class WithModalContainer extends PureComponent {
    state = { visible: true };
    componentDidMount = () => {
      console.log("my Modal: ", this.props, this.state, window.scrollY);
    }
    handleCancel = () => {
      this.setState({ visible: false });
      this.props.onCancel();
    };
    render() {
      return (
        <Modal
          width={960}
          style={{ top: window.scrollY + 20 }}
          title={this.props.title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Component {...this.props} />
        </Modal>
      );
    }
  };
}

export default WithModal;
