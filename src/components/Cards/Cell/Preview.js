import React, { PureComponent } from "react";
import EphysPreview from "./EphysPreview";
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
        <EphysPreview traces={value.traces} disabled={hoveringOverMorph}/>
        <MorphologyPreview onHover={this.handlehoverOverMorph.bind(this)} value={value} hovering={hoveringOverMorph}/>
      </div>
    );
  }
}

export default Preview;
