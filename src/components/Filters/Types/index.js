import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { types, navigate } from "../../../store/actions";
import getQueryFromUrl from "../../../libs/query";
import TypesComponent from "./TypesComponent";

class TypesContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchTypes(this.props.query);
  }
  componentDidUpdate (props) {
    // TODO move to middleware?
    if (props.query !== this.props.query) {
      this.props.fetchTypes(this.props.query);
    }
  }
  onSelect (value) {
    this.props.updateQuery({ type: value });
  }
  onHover (value) {
    this.props.hoverType(value);
  }
  clearFilters () {
    this.props.updateQuery({ type: null, filter: null, query:null });
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
  updateQuery: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  error: PropTypes.any,
  query: PropTypes.string,
  selectedType: PropTypes.string,
  types: PropTypes.any.isRequired
};

function mapStateToProps({ types: typeData, routing }) {
  const { pending, error, types } = typeData;
  const { selectedType, queryTerm } = getQueryFromUrl(routing);
  return {
    query: queryTerm,
    selectedType,
    pending,
    error,
    types
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateQuery: bindActionCreators(navigate.updateQuery, dispatch),
    fetchTypes: bindActionCreators(types.fetchTypes, dispatch),
    hoverType: bindActionCreators(types.updateHoverType, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TypesContainer);
