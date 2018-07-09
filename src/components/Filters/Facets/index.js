import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { facets, navigate } from "../../../store/actions";
import FacetsComponent from "./FacetsComponent";
import getQueryFromUrl from "../../../libs/query";
import { truthy } from "../../../libs/utils";

class FacetContainer extends React.Component {
  state = { facet: {} };
  componentDidMount() {
    this.props.fetchFacets(this.props.selectedType, this.props.queryTerm);
  }
  componentDidUpdate (props) {
    // TODO move fetchFacets to middleware?
    if (props.selectedType !== this.props.selectedType) {
      this.props.fetchFacets(this.props.selectedType, this.props.queryTerm);
    }
    if (props.queryTerm !== this.props.queryTerm) {
      this.props.fetchFacets(this.props.selectedType, this.props.queryTerm);
    }
  }
  onSelect (key, value) {
    let { facet } = this.state;
    facet[key] = value;
    this.setState({ facet: truthy(facet) }, () => {
      this.props.updateQuery({ filter: this.state.facet });
    });
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
  const { selectedType, selectedFacets, queryTerm } = getQueryFromUrl(routing);
  return {
    selectedType,
    selectedFacets,
    queryTerm,
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