import React from "react";
import World from "../libs/World";

class MorphologyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.viewContainer = React.createRef();

    this.viewContainer = null;

    this.setViewContainer = element => {
      this.viewContainer = element;
      this.makeVisualizer();
    };
  }
  makeVisualizer() {
    if (this.viewContainer) {
      this.world = new World(this.viewContainer, this.props.worldOptions);
      this.world.animate();
    }
  }
  render () {
    return (
      <div className={"world " + this.props.className} ref={this.setViewContainer}>
      </div>
    );
  }
}


export default MorphologyContainer;