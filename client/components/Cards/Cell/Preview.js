import React, { PureComponent } from "react";
import MorphologyPreview from "./MorphologyPreview";

class Preview extends PureComponent {
  state = { hoveringOverMorph: false }
  handlehoverOverMorph (hovering) {
    this.setState({ hoveringOverMorph: hovering });
  }
  render() {
    let { hoveringOverMorph } = this.state;
    let { value } = this.props;
    return (
      <div className="card-morph">
        <MorphologyPreview preview onHover={this.handlehoverOverMorph.bind(this)} value={value} shouldRender={hoveringOverMorph} polyLine/>
      </div>
    );
  }
}

export default Preview;
