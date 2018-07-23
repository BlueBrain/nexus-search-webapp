import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Results from "./ResultsComponent";
import { query, search } from "../../../store/actions";
import { isEqual } from "underscore"

class ResultsContainer extends Component {
  state = { selected: null };
  componentDidMount() {
    this.search();
  }
  componentDidUpdate(prevProps) {
    console.log({prevProps})
    if (
      prevProps.query !== this.props.query ||
      prevProps.type !== this.props.type ||
      prevProps.from !== this.props.from ||
      !isEqual(prevProps.filter, this.props.filter)
    ) {
      this.search();
    }
  }
  handlePageClick({selected}) {
    const from = Math.ceil(selected * this.props.pageSize);
    this.setState({ selected });
    this.props.updateSearchParams({ from });
  }
  search() {
    this.props.search();
  }
  render() {
    let { selected } = this.state;
    return Results(this.props, {
      pageSize: this.props.pageSize,
      selected,
      handlePageClick: this.handlePageClick.bind(this)
    });
  }
}

ResultsContainer.propTypes = {
  search: PropTypes.func.isRequired,
  results: PropTypes.any,
  hits: PropTypes.number,
  pending: PropTypes.bool,
  pageSize: PropTypes.number,
  filter: PropTypes.any,
  api: PropTypes.string.isRequired,
  from: PropTypes.number.isRequired,
  listType: PropTypes.string.isRequired
};

function mapStateToProps({ config, query, search }) {
  const { q, type, filter, size, from } = search;
  return {
    pageSize: size,
    api: config.api,
    results: query.results,
    hits: query.hits,
    pending: query.pending,
    from,
    query: q,
    type,
    // why!
    filter: {...filter}
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