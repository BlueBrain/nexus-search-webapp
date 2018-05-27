import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { Shapes, Spinner } from "@bbp/nexus-react";
import { query, navigate } from "../store/actions";
import qs from 'query-string';
// import { Button, Input, Icon, Radio } from 'antd';

const DEFAULT_PAGE_SIZE = 50;

const Paginate = ({ totalPages, selected, handlePageClick }) => {
  return (
    <ReactPaginate
      containerClassName="pagination column-footer"
      previousLabel={"<"}
      nextLabel={">"}
      breakLabel={<a href="">...</a>}
      breakClassName={"break-me"}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
      forcePage={selected}
    />
  );
};

Paginate.propTypes = {
  totalPages: PropTypes.number.isRequired,
  selected: PropTypes.any.isRequired,
  handlePageClick: PropTypes.func.isRequired
};

const SearchResultsFound = (results, hits, pageParams, goToEntityByID, api) => {
  return (
    <React.Fragment>
      <ul id="search-results" className="grow">
        {results.map((result, index) => {
          return (
            <li
              key={`${result._source['@id']}-${index}`}
              onClick={() => goToEntityByID(result._source['@id'])}
            >
              <Shapes.Relationship value={result._source} api={api} />
            </li>
          );
        })}
        {results.length ? (
          <div>
            Displaying: {results.length}
            <small> of {hits} instances found</small>
          </div>
        ) : (
          <div>No instances found</div>
        )}
      </ul>
      {hits - results.length > 0 &&
        Paginate({ totalPages: hits / pageParams.pageSize, ...pageParams })}
    </React.Fragment>
  );
};

const SearchResults = ({ pending, results, hits, goToEntityByID, api}, pageParams) => {
  return (
    <div>
      <h1 className="search-feedback border-bottom">
        Search results for &quot;{"something"}&quot;
      </h1>
      {pending && (
        <div className="center grow spinner">
          <Spinner />
        </div>
      )}
      {!!results.length &&
        SearchResultsFound(results, hits, pageParams, goToEntityByID, api)}
      {!results.length &&
        !pending && (
          <div className="center grow">
            <h3>Hmmmm...</h3>
            <p>
              We didn&#39;t manage to find any instances matching &quot;{"q uery"}&quot;
            </p>
            {/* {!loggedIn && (
              <p>
                Expecting something different? try{" "}
                <a href={`${loginURI}?q=${query}`}>logging in.</a>
              </p>
            )} */}
          </div>
        )}
    </div>
  );
};

class SearchResultsContainer extends React.Component {
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
  componentDidUpdate (props) {
    console.log('update?', this.props)
    if (props.query !== this.props.query) {
      this.search();
    }
    if (props.type !== this.props.type) {
      this.search();
    }
  }
  handlePageClick({ selected }) {
    const from = Math.ceil(selected * this.pageSize);
    this.setState({ from, selected }, () => this.search(this.props));
  }
  search() {
    let { query, type } = this.props;
    let { from } = this.state;
    this.props.search({ query, from, size: this.pageSize, type });
  }
  render() {
    let { selected } = this.state;
    return SearchResults(this.props, {
      pageSize: this.pageSize,
      selected,
      handlePageClick: this.handlePageClick.bind(this)
    });
  }
}

SearchResultsContainer.propTypes = {
  search: PropTypes.func.isRequired,
  goToEntityByID: PropTypes.func.isRequired,
  results: PropTypes.any,
  hits: PropTypes.number,
  pending: PropTypes.bool,
  pageSize: PropTypes.number,
  api: PropTypes.string.isRequired
};

function mapStateToProps({ config, query, routing }) {
  const queryTerm = qs.parse(routing.location.search).q;
  const selectedType = qs.parse(routing.location.search).type;
  console.log('result props', queryTerm, selectedType)
  return {
    pageSize: config.pageSize,
    api: config.api,
    results: query.results,
    hits: query.hits,
    pending: query.pending,
    query: queryTerm,
    type: selectedType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    search: bindActionCreators(query.fetchQuery, dispatch),
    goToEntityByID: bindActionCreators(navigate.goToEntityByID, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SearchResultsContainer
);
