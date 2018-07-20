import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { facets, search } from "../../../store/actions";
import FacetsComponent from "./FacetsComponent";
import { isEqual } from "underscore"

class FacetContainer extends React.PureComponent {
  componentDidMount() {
    this.props.fetchFacets();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.query !== this.props.query ||
      prevProps.type !== this.props.type ||
      !isEqual(prevProps.selectedFilter, this.props.selectedFilter)
    ) {
      this.props.fetchFacets();
    }
  }
  onSelect (key, value) {
    let filter = this.props.selectedFilter;
    filter[key] = value;
    this.props.updateSearchParams({ filter });
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
  return {
    selectedType: search.type,
    // This is strange...
    selectedFilter: {...search.filter},
    queryTerm: search.q,
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