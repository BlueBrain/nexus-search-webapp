import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { types } from "../store/actions";
import { bindActionCreators } from "redux";
import TypeIcon from "./TypeIcon";

const DEFAULT_TYPE = {
  icon: "cube",
  color: "#ced2c9"
};

class TypeIconContainer extends React.Component {
  componentDidMount() {
    if (!this.props.types.length) {
      this.props.fetchTypes();
    }
  }
  render() {
    const { type, types } = this.props;
    let selectedTypes = types.filter(({ value }) => {
      let unexpanedValue = value
        .split("/")
        .pop()
        .toLowerCase();
      return type.toLowerCase().indexOf(unexpanedValue) >= 0;
    });
    let selectedTypeObject = selectedTypes.length
      ? selectedTypes[0]
      : DEFAULT_TYPE;
    let { icon: iconURL, color } = selectedTypeObject;
    return TypeIcon({ iconURL, color });
  }
}

TypeIconContainer.propTypes = {
  types: PropTypes.any,
  type: PropTypes.any.isRequired,
  fetchTypes: PropTypes.func.isRequired
};

function mapStateToProps({ types }) {
  return {
    types: types.types
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTypes: bindActionCreators(types.fetchTypes, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TypeIconContainer);
