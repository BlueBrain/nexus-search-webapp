import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { types, search } from "../../../store/actions";
import TypesComponent from "./TypesComponent";

class TypesContainer extends React.Component {
  componentDidMount() {
    this.props.fetchTypes();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.query !== this.props.query ||
      prevProps.selectedType !== this.props.selectedType
    ) {
      this.props.fetchTypes();
    }
  }
  onSelect (value) {
    this.props.updateSearchParams({ type: value });
  }
  onHover (value) {
    this.props.hoverType(value);
  }
  clearFilters () {
    this.props.updateSearchParams({ type: null, filter: null, q: null, sort: null });
  }
  render() {
    const { pending, error, types, selectedType } = this.props;
    const onSelect = this.onSelect.bind(this);
    const clearFilters = this.clearFilters.bind(this);
    const onHover = this.onHover.bind(this);
    return TypesComponent({ pending, error, types, onSelect, selectedType, clearFilters, onHover });
  }
}

TypesContainer.propTypes = {
  fetchTypes: PropTypes.func.isRequired,
  updateSearchParams: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  error: PropTypes.any,
  query: PropTypes.string,
  selectedType: PropTypes.string,
  types: PropTypes.any.isRequired
};

function mapStateToProps({ types: typeData, search }) {
  const { pending, error, types } = typeData;
  return {
    query: search.q,
    selectedType: search.type,
    pending,
    error,
    types
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch),
    fetchTypes: bindActionCreators(types.fetchTypes, dispatch),
    hoverType: bindActionCreators(types.updateHoverType, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TypesContainer);
