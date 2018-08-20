import React from "react";
import PropTypes from "prop-types";
import CursorPosition from "react-cursor-position";
import { throttle } from "underscore";

const DEFUALT_MAX_ROTATION_DEG = 15;
const THROTTLE_IN_MS = 10;

const PerspectivizerComponent = ({ children, rotation, active }) => (
  <div
    className="give-me-perspective"
    style={{
      transformStyle: "preserve-3d",
      transition: active ? null : "all .3s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
      transform: `rotate3d(0, 1, 0, ${rotation}deg)`
    }}
  >
    {children({ active })}
  </div>
);

function waveYInRad(x, xOffset, yOffset, amplitude, width) {
  return amplitude * Math.cos(x / xOffset) + 0;
}
class PerspectivizerContainer extends React.PureComponent {
  state = { rotation: 0 };
  constructor() {
    super();
    this.updateRotation = throttle(
      this.updateRotation.bind(this),
      THROTTLE_IN_MS
    );
  }
  updateRotation() {
    if (this.props.isActive) {
      const {
        maxRotation = DEFUALT_MAX_ROTATION_DEG,
        elementDimensions: { width = 0 } = {},
        isActive = false,
        position: { x = 0 } = {}
      } = this.props;

      const a = maxRotation;
      const k = a;
      const b = width / Math.PI;
      const rotation = -waveYInRad(x, b, k, a, width);
      this.setState({ rotation });
    }
  }
  resetRotation() {
    this.setState({ rotation: 0 });
  }
  componentDidUpdate(prevProps) {
    if (this.props.isPositionOutside) {
      return this.resetRotation();
    }
    if (!this.props.disabled && this.props.isActive && this.props.position.x !== prevProps.position.x) {
      this.updateRotation();
    }
  }
  render() {
    const { children, isPositionOutside } = this.props;
    const { rotation } = this.state;
    return PerspectivizerComponent({
      children,
      rotation,
      active: !isPositionOutside
    });
  }
}

const PerspectivizerWrapper = ({ children, ...props }) => (
  <CursorPosition>
    <PerspectivizerContainer {...props}>{children}</PerspectivizerContainer>
  </CursorPosition>
);

export default PerspectivizerWrapper;
