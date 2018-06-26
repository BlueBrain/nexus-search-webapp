import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { Shapes, Spinner } from "@bbp/nexus-react";
import { query, navigate, lightbox } from "../store/actions";
import qs from "query-string";
import { Select, Icon, Radio, Spin } from "antd";
import GridResults from "./GridResults";
import icons from "./Icons";
import SVG from "react-svg";

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

const SearchToolbar = ({ hits }) => {
  const Option = Select.Option;
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  return (
    <div className="search-toolbar flex space-between">
      <div className="">
        <p>{hits} results found</p>
      </div>
      <div className="">
        <Select defaultValue="lucy" style={{ width: 120 }} onChange={() => {}}>
          <Option value="jack">Relevance</Option>
          <Option value="lucy">Name</Option>
        </Select>{" "}
        <RadioGroup onChange={() => {}} defaultValue="a">
          <RadioButton value="a">
            <Icon type="appstore-o" />
          </RadioButton>
          <RadioButton value="b">
            <Icon type="profile" />
          </RadioButton>
        </RadioGroup>
      </div>
    </div>
  );
};

const SearchResultsList = ({ results, api, goToEntityByID }) => {
  return (
    <ul id="search-results" className="grow">
      {results.map((result, index) => {
        return (
          <li
            key={`${result._source["@id"]}-${index}`}
            onClick={() => goToEntityByID(result._source["@id"])}
          >
            <Shapes.Relationship value={result._source} api={api} />
          </li>
        );
      })}
    </ul>
  );
};

const SearchResultsGrid = ({ results, api, goToEntityByID, openVisualizer, hoverType }) => {
  return (
    <div id="search-results" className="flex wrap">
      {results.map((result, index) => {
        return (
          <GridResults
            key={`${result._source["@id"]}-${index}`}
            value={result._source}
            openVisualizer={openVisualizer}
            goToEntityByID={goToEntityByID}
          />
        );
      })}
    </div>
  );
};

const SearchResultsFound = (
  results,
  hits,
  pageParams,
  goToEntityByID,
  api,
  hoverType,
  types,
  openVisualizer
) => {
  return (
    <React.Fragment>
      <SearchToolbar hits={hits} />
      {/* <SearchResultsList results={results} api={api} goToEntityByID={goToEntityByID}/> */}
      <SearchResultsGrid
        results={results}
        api={api}
        goToEntityByID={goToEntityByID}
        hoverType={hoverType}
        types={types}
        openVisualizer={openVisualizer}
      />
      {results.length ? (
        <div>
          Displaying: {results.length}
          <small> of {hits} instances found</small>
        </div>
      ) : (
        <div>No instances found</div>
      )}
      {hits - results.length > 0 &&
        Paginate({ totalPages: hits / pageParams.pageSize, ...pageParams })}
    </React.Fragment>
  );
};
// const Hero = () => (
//   <div className="hero">
//     <h1>This is bananas</h1>
//     <p>stuff dont think it be like that but it do</p>
//   </div>
// )

const SearchResults = (
  { pending, results, hits, goToEntityByID, api, hoverType, types, openVisualizer },
  pageParams
) => {
  return (
    <div className="center grow full full-height column">
      {pending && (
        <div className="center grow spinner">
          <div style={{ width: 100, margin: "200px auto" }}>
            <Spin size="large" tip={"fetching items"} />
          </div>
        </div>
      )}
      {!!results.length &&
        SearchResultsFound(
          results,
          hits,
          pageParams,
          goToEntityByID,
          api,
          hoverType,
          types,
          openVisualizer
        )}
      {!results.length &&
        !pending && (
          <div className="center grow full full-height column">
            <div className="no-results">
              <SVG
                path={icons.notFound}
                svgClassName="nothing-found-svg"
                className="nothing-found-icon"
              />
              <h3>Nothing matching your query was found</h3>
            </div>
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
  openVisualizer: PropTypes.func.isRequired,
  results: PropTypes.any,
  hits: PropTypes.number,
  pending: PropTypes.bool,
  pageSize: PropTypes.number,
  filter: PropTypes.string,
  api: PropTypes.string.isRequired
};

function mapStateToProps({ config, query, routing }) {
  const queryTerm = qs.parse(routing.location.search).q;
  const selectedType = qs.parse(routing.location.search).type;
  const filter = qs.parse(routing.location.search).filter;
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
    goToEntityByID: bindActionCreators(navigate.goToEntityByID, dispatch),
    openVisualizer: bindActionCreators(lightbox.lightboxOpen, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsContainer);
