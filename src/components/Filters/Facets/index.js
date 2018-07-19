import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { facets, navigate } from "../../../store/actions";
import FacetsComponent from "./FacetsComponent";
import getQueryFromUrl from "../../../libs/query";

class FacetContainer extends React.PureComponent {
  componentDidMount () {
    this.props.fetchFacets();
  }
  onSelect (key, value) {
    let filter = this.props.selectedFacets;
    filter[key] = value;
    this.props.updateQuery({ filter });
  }
  render() {
    const onSelect = this.onSelect.bind(this);
    return FacetsComponent({ onSelect, ...this.props });
  }
}

FacetContainer.propTypes = {
  fetchFacets: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  selectedFacets: PropTypes.any,
  selectedType: PropTypes.string,
  queryTerm: PropTypes.string,
  facets: PropTypes.any,
  pending: PropTypes.bool,
  error: PropTypes.any
};

function mapStateToProps({ facets, routing }) {
  const { results } = facets;
  // TODO map selected type in middleware?
  const { selectedType, selectedFacets, queryTerm, filter } = getQueryFromUrl(routing);
  return {
    selectedType,
    selectedFacets,
    queryTerm,
    filter,
    facets: results,
    ...facets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateQuery: bindActionCreators(navigate.updateQuery, dispatch),
    fetchFacets: bindActionCreators(facets.fetchFacets, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetContainer);