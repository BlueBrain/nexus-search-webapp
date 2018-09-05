import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { types } from "../store/actions";
import { bindActionCreators } from "redux";
import TypeIcon from "./TypeIcon";
import { findWhere } from "underscore";

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
    let selectedTypes = this.props.types.filter(type => {
      let [, value] = type.value.split(":");
      value = value.toLowerCase();
      return this.props.type.toLowerCase().indexOf(value) >= 0;
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
