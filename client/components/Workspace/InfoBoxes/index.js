import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Transition, config } from "react-spring";
import Boxes from "./Boxes";
import { bindActionCreators } from "redux";
import { infobox as boxActions } from "@client/store/actions";
import { isEqual } from "underscore";

class InfoBoxListContainer extends React.PureComponent {
  updateFilterBox() {
    // TODO add this business logic inside each message box instead of here?
    if ((this.props.filter && Object.keys(this.props.filter).length > 0) || this.props.q) {
      this.props.add("Filters");
    } else {
      this.props.remove("Filters");
    }
  }
  componentDidMount() {
    this.updateFilterBox();
  }
  componentDidUpdate(prevProps) {
    // TODO move logic to shouldComponentUpdate
    let same = isEqual(prevProps.filter, this.props.filter) && prevProps.q === this.props.q
    if (!same) { this.updateFilterBox() }
  }
  render() {
    const { infoBoxes, remove: handleDismiss } = this.props;
    return InfoBoxListComponent({
      infoBoxes,
      handleDismiss
    });
  }
}

InfoBoxListContainer.propTypes = {};

function mapStateToProps({ search, infobox }) {
  const { q, type, filter } = search;
  return {
    q,
    type,
    filter: { ...filter },
    infoBoxes: infobox.messages
  };
}

const InfoBoxListComponent = ({ infoBoxes, handleDismiss }) => {
  return (
    <ul id="info-boxes">
      <Transition
        config={config.wobbly}
        keys={infoBoxes}
        from={{ opacity: 0, right: -100 }}
        enter={{ opacity: 1, right: 0 }}
        leave={{ opacity: 0, right: -100, pointerEvents: "none" }}
      >
        {infoBoxes.map((key, index) => styles => {
          const Box = Boxes[key];
          return (
            <li key={key + "-" + index} style={styles}>
              <Box onDismiss={() => handleDismiss(key)} />
            </li>
          );
        })}
      </Transition>
    </ul>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    add: bindActionCreators(boxActions.addInfobox, dispatch),
    remove: bindActionCreators(boxActions.removeInfobox, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoBoxListContainer);
