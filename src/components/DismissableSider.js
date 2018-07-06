import React from "react";
import { Icon } from "antd";

export class DismissableSiderContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { open: true };
  }
  handleDismiss () {
    let open = this.state.open;
    this.setState({ open: !open })
  }
  render() {
    const { children, style } = this.props;
    const { open } = this.state;
    const handleDismiss = this.handleDismiss.bind(this);
    return DismissableSiderComponent({ children, style, open, handleDismiss });
  }
}

const DismissableSiderComponent = ({ children, style, open, handleDismiss }) => (
  <section className={"dismissable-sider " + (open ? "open" : "")} style={style}>
    <DismissSiderButtonComponent onClick={handleDismiss}/>
    <div className="dismissable-sider-content">{children}</div>
  </section>
);

const DismissSiderButtonComponent = ({ onClick }) => (
  <a className="dismissable-sider-button" onClick={onClick}>
    <div className="rotate-me">
      <Icon type="right" />
    </div>
  </a>
)

export default DismissableSiderContainer;