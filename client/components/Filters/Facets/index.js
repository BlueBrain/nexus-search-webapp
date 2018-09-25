import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { facets, search } from "../../../store/actions";
import FacetsComponent from "./FacetsComponent";
import isEqual from "fast-deep-equal";

class FacetContainer extends Component {
  componentDidMount() {
    this.props.fetchFacets();
  }
  onSelect (key, value) {
    let filter = this.props.selectedFilter;
    filter[key] = value;
    // reset pagination after selecting new filters
    // because we dont know how many entries we would get
    this.props.updateSearchParams({ filter, from: 0 });
  }
  render() {
    const onSelect = this.onSelect.bind(this);
    return FacetsComponent({ onSelect, ...this.props });
  }
}

FacetContainer.propTypes = {
  fetchFacets: PropTypes.func.isRequired,
  updateSearchParams: PropTypes.func.isRequired,
  selectedFilter: PropTypes.any,
  selectedType: PropTypes.string,
  queryTerm: PropTypes.string,
  facets: PropTypes.any,
  pending: PropTypes.bool,
  error: PropTypes.any
};

function mapStateToProps({ facets, search }) {
  const { results } = facets;
  const { filter, type, q } = search;
  return {
    type,
    // This is strange... a new object must be created or else it won't trigger an update
    selectedFilter: filter,
    query: q,
    facets: results,
    ...facets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch),
    fetchFacets: bindActionCreators(facets.fetchFacets, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetContainer);