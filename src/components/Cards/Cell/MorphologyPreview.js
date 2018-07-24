import React, { PureComponent } from "react";
import MorphologyViewer from "../../MorphologyViewer";
import fakeMorphology from "../../../../public/img/fakeMorpho.png";

class MorphologyPreview extends PureComponent {
  state = { show: false, img: null }
  constructor (props) {
    super(props);
    this.viewContainer = React.createRef();
  }
  componentDidMount () {
    // this.processImage();
  }
  render() {
    let { hovered, value } = this.props;
    const divStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%", height: "100%",
    }
    return (
      <div style={{ width: "100%", height: "100%" }}>
          {
              // hovered ?
              <div style={divStyle}><MorphologyViewer {...value} /></div>
              // :
              // <div style={divStyle}><img src={fakeMorphology} style={{ width: "100%", height: "100%" }} /></div>
          }
      </div>
    );
  }
}

export default MorphologyPreview;
