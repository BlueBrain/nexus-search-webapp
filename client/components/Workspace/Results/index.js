import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Results from "./ResultsComponent";
import { query, search } from "../../../store/actions";
import isEqual from "fast-deep-equal"

class ResultsContainer extends Component {
  componentDidMount() {
    this.props.search();
  }
  handlePageClick({selected}) {
    const from = Math.ceil(selected * this.props.pageSize);
    this.props.updateSearchParams({ from });
  }
  render() {
    return Results(this.props, {
      pageSize: this.props.pageSize,
      selected: Math.floor(this.props.from / this.props.pageSize),
      handlePageClick: this.handlePageClick.bind(this)
    });
  }
}

ResultsContainer.propTypes = {
  search: PropTypes.func.isRequired,
  results: PropTypes.any,
  sort: PropTypes.any,
  hits: PropTypes.number,
  pending: PropTypes.bool,
  pageSize: PropTypes.number,
  filter: PropTypes.any,
  api: PropTypes.string.isRequired,
  from: PropTypes.number.isRequired,
  listType: PropTypes.string.isRequired
};

function mapStateToProps({ config, query, search }) {
  const { q, type, filter, size, from, sort } = search;
  return {
    pageSize: size,
    api: config.api,
    results: query.results,
    hits: query.hits,
    pending: query.pending,
    from,
    sort: sort,
    query: q,
    type,
    filter: filter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    search: bindActionCreators(query.fetchQuery, dispatch),
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsContainer);