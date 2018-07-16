import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Results from "./ResultsComponent";
import getQueryFromUrl from "../../../libs/query";
import { query } from "../../../store/actions";

class ResultsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 0,
      selected: null
    };
    this.pageSize = this.props.pageSize || DEFAULT_PAGE_SIZE;
  }
  componentDidMount() {
    this.search();
  }
  componentDidUpdate(props) {
    if (props.query !== this.props.query) {
      this.search();
    }
    if (props.type !== this.props.type) {
      this.search();
    }
    if (props.filter !== this.props.filter) {
      this.search();
    }
  }
  handlePageClick({ selected }) {
    const from = Math.ceil(selected * this.pageSize);
    this.setState({ from, selected }, () => this.search(this.props));
  }
  search() {
    let { query, type, filter } = this.props;
    let { from } = this.state;
    this.props.search({ query, from, size: this.pageSize, type, filter });
  }
  render() {
    let { selected } = this.state;
    return Results(this.props, {
      pageSize: this.pageSize,
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
  filter: PropTypes.string,
  api: PropTypes.string.isRequired,
  listType: PropTypes.string.isRequired
};

function mapStateToProps({ config, query, routing }) {
  const { selectedType, queryTerm, filter } = getQueryFromUrl(routing);
  return {
    pageSize: config.pageSize,
    api: config.api,
    results: query.results,
    hits: query.hits,
    pending: query.pending,
    query: queryTerm,
    type: selectedType,
    filter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    search: bindActionCreators(query.fetchQuery, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsContainer);