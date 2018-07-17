import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Transition, config } from "react-spring";
import getQueryFromUrl from "../../../libs/query";
import Boxes from "./Boxes";

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
  componentWillReceiveProps(props) {
    if (
      props.filter &&
      props.filter !== this.props.filter &&
      Object.keys(props.filter).length > 0
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

function mapStateToProps({ routing }) {
  const { selectedType, queryTerm, selectedFacets } = getQueryFromUrl(routing);
  return {
    selectedType,
    queryTerm,
    filter: selectedFacets
  };
}

const InfoBoxListComponent = ({ infoBoxes }) => {
  return (
    <ul id="info-boxes">
      <Transition
        config={config.wobbly}
        keys={infoBoxes.map(item => item.key)}
        from={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0}}
        enter={{ opacity: 1, height: "auto", marginTop: 16, marginBottom: 16 }}
        leave={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, pointerEvents: "none" }}
      >
        {infoBoxes.map((entry, index) => styles => {
          return <li key={entry.key + "-" + index} style={styles}>{entry.component}</li>;
        })}
      </Transition>
    </ul>
  );
};

export default connect(mapStateToProps)(InfoBoxListContainer);
