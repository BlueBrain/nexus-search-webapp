import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { lightbox } from "../store/actions";
import PropTypes from "prop-types";
import Logo from "../../public/img/logo.png";
import { Icon } from "antd";
import Icons from "./Icons";
import SVG from "react-svg";

function goFullscreen(e) {
  e.preventDefault();
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement
  ) {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    }
  }
  const i = document.getElementById("visualizer");
  if (i.requestFullscreen) {
    i.requestFullscreen();
  } else if (i.webkitRequestFullscreen) {
    i.webkitRequestFullscreen();
  } else if (i.mozRequestFullScreen) {
    i.mozRequestFullScreen();
  } else if (i.msRequestFullscreen) {
    i.msRequestFullscreen();
  }
}

const fullscreenAvailable =
  document.fullscreenEnabled ||
  document.webkitFullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullscreenEnabled;

const Details = ({ close }) => {
  return (
    <div className="details">
      <div className="details-logo">
        <img src={Logo} />
      </div>
      <div className="close">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            close();
          }}
        >
          <Icon type="close" />
        </a>
      </div>
      <div className="headline">
        <h1>Cell title</h1>
        <span className="meta">Morphology Viewer</span>{" "}
        <a href="#">
          <Icon type="question-circle-o" />
        </a>
      </div>
    </div>
  );
};

const Viewer = ({ children }) => {
  return (
    <div className="viewer full-height" id="visualizer">
      {fullscreenAvailable && (
        <div className="fullscreen">
          <a href="#" onClick={goFullscreen}>
            <SVG
              path={Icons.fullscreen}
              svgClassName="fullscreen-svg"
              className="fullscreen-icon"
            />
          </a>
        </div>
      )}
      {children}
    </div>
  );
};

const LightboxComponent = ({ close, children }) => {
  return (
    <div className="lightbox">
      <Details close={close} />
      <Viewer>
        {children}
      </Viewer>
    </div>
  );
};

class LightboxContainer extends React.Component {
  render() {
    return this.props.open ? LightboxComponent(this.props) : null;
  }
}

function mapStateToProps({ lightbox }) {
  return {
    open: lightbox.open
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close: bindActionCreators(lightbox.lightboxClose, dispatch)
  };
}

LightboxContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LightboxContainer);
