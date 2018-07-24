import React, { PureComponent } from "react";

function process (canvasElement, image) {
  if (!canvasElement) { return; }
  var canvas = canvasElement,   // canvas
      ctx = canvasElement.getContext("2d"),               // context
      w = canvasElement.clientWidth, h = canvasElement.clientHeight,
      idata, data32, len, i, px;                   // iterator, pixel etc.
      canvasElement.width = w;                                // set canvas size
      canvasElement.height = h;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  // ctx.translate(5, 5);
  ctx.drawImage(image, 0, 0, w, h);

  idata = ctx.getImageData(0, 0, w, h);            // get imagedata
  data32 = new Uint32Array(idata.data.buffer);     // use uint32 view for speed
  len = data32.length;

  for(i = 0; i < len; i++) {
    px = data32[i];                                // pixel

    // is white? then knock it out
    if (px === 0xffffffff) data32[i] = px = 0;

    // extract alpha channel from a pixel
    // px = px & 0xff000000;                          // little-endian: ABGR

    // any non-transparency? ie. alpha > 0
    // if (px) {
    //   data32[i] = px | 0x000000;    // set this pixel to white, keep alpha level
    // }
  }

  ctx.putImageData(idata, 0, 0);
}

class EphysPreview extends PureComponent {
  state = { show: false, img: null }
  constructor (props) {
    super(props);
    this.viewContainer = React.createRef();
  }
  componentDidMount () {
    // this.processImage();
  }
  setViewContainer (element) {
    this.viewContainer = element;
    this.processImage();
  }
  processImage () {
    this.image = new Image();
    this.image.crossOrigin = "";
    this.image.onload = () => {
      // this.setState({ show: true, img: this.image.src })
      this.setState({ show: true }, process(this.viewContainer, this.image));
    };
    this.image.onerror = () => this.setState({ show: false });
    this.image.src = this.props.previewImage;
  }
  render() {
    let { show, img } = this.state;
    return (
      <div className={`ephys ${show && "fade-in"}`} style={{ zIndex: 1 }}>
        {/* {show &&
          <img src={this.props.previewImage} />
        } */}
        <canvas ref={this.setViewContainer.bind(this)}></canvas>}
      </div>
    );
  }
}

export default EphysPreview;
