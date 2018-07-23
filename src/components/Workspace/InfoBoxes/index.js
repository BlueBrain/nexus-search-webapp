import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Transition, config } from "react-spring";
import Boxes from "./Boxes";
import { isEqual } from "underscore"

class InfoBoxListContainer extends React.PureComponent {
  constructor() {
    super();
    this.infoBoxDict = Object.keys(Boxes).reduce((memo, key) => {
      const Component = Boxes[key];
      memo[key] = {
        key,
        component: <Component onDismiss={() => this.handleDismiss(key)} />
      };
      return memo;
    }, {});
    this.state = {
      infoBoxes: [this.infoBoxDict["GettingStarted"]]
    };
  }
  handleDismiss(keyToDismiss) {
    const infoBoxes = this.state.infoBoxes.filter(
      entry => entry.key !== keyToDismiss
    );
    this.setState({
      infoBoxes
    });
  }
  componentWillReceiveProps(prevProps) {
    if (
      prevProps.filter &&
      Object.keys(prevProps.filter).length > 0
    ) {
      this.appendBox("Filters");
    } else {
      this.handleDismiss("Filters");
    }
  }
  appendBox(keyToAppend) {
    if (
      this.state.infoBoxes.filter(entry => keyToAppend === entry.key).length ===
      0
    ) {
      let infoBoxes = this.state.infoBoxes;
      infoBoxes.push(this.infoBoxDict[keyToAppend]);
      this.setState({ infoBoxes });
    }
  }
  render() {
    const { infoBoxes } = this.state;
    return InfoBoxListComponent({ infoBoxes });
  }
}

InfoBoxListContainer.propTypes = {};

function mapStateToProps({ search }) {
  const { q, type, filter } = search;
  return {
    q,
    type,
    filter: {...filter}
  };
}

const InfoBoxListComponent = ({ infoBoxes }) => {
  return (
    <ul id="info-boxes">
      <Transition
        config={config.wobbly}
        keys={infoBoxes.map(item => item.key)}
        from={{ opacity: 0, right: -100 }}
        enter={{ opacity: 1, right: 0 }}
        leave={{ opacity: 0, right: -100, pointerEvents: "none" }}
      >
        {infoBoxes.map((entry, index) => styles => {
          return <li key={entry.key + "-" + index} style={styles}>{entry.component}</li>;
        })}
      </Transition>
    </ul>
  );
};

export default connect(mapStateToProps)(InfoBoxListContainer);
