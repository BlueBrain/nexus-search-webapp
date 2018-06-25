import React from "react";
import { WithStore, Dropdown, Shapes } from "@bbp/nexus-react";
import PropTypes from 'prop-types';
import { navigate } from "../store/actions";
import { Button, Input, Icon, Radio } from 'antd';
import qs from 'query-string';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const { Search } = Input;

// const SearchRecommendationsDropdown = ({
//   down,
//   value,
//   results,
//   hits,
//   api,
//   goToEntityByID,
//   onSubmit
// }) => (
//   <Dropdown down={down}>
//     {!!results.length && (
//       <div className="search-feedback">
//         <Search.components.SearchForComponent
//           className="nudge-on-hover"
//           value={value}
//           href="/"
//           onSubmit={onSubmit}
//         />
//       </div>
//     )}
//     <div className="padding border-bottom">
//       {results.length ? (
//         <div>
//           Displaying: {results.length}
//           <small> of {hits} instances found</small>
//         </div>
//       ) : (
//         <div>No instances found</div>
//       )}
//       {RecommendationsList(results, api, goToEntityByID)}
//     </div>
//     {hits - results.length > 0 && <div className="paddingless"><a onClick={onSubmit} className="nudge-on-hover padding half"><span>See more</span></a></div>}
//   </Dropdown>
// );

// SearchRecommendationsDropdown.propTypes = {
//   down: PropTypes.bool.isRequired,
//   value: PropTypes.string.isRequired,
//   results: PropTypes.number.isRequired,
//   hits: PropTypes.number.isRequired,
//   api: PropTypes.string.isRequired,
//   goToEntityByID: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired
// };

// const RecommendationsList = (results, api, goToEntityByID) => (
//   <React.Fragment>
//     {!!results.length && (
//       <ul id="search-results">
//         {results.map(result => {
//           return (
//             <li
//               key={result.resultId}
//               onClick={() => goToEntityByID(result.resultId)}
//             >
//               <Shapes.Relationship value={result.source} api={api} />
//             </li>
//           );
//         })}
//       </ul>
//     )}
//   </React.Fragment>
// );

const SearchBar = ({ query, onSearch, onKeyDown }) => (
  <div className="search-bar-block">
    <Search
      placeholder="input search text"
      onSearch={onSearch}
      defaultValue={query}
    />
  </div>
);

class SearchBarContainer extends React.Component {
  onKeyDown (value) {
    // TODO add blur
    this.props.updateQuery({ query: value });
  }
 onSearch (value) {
   this.props.updateQuery({ query: value || null });
 }
  render() {
    const { query } = this.props;
    return SearchBar({ query, onSearch: this.onSearch.bind(this), onKeyDown: this.onKeyDown.bind(this) });
  }
}

function mapStateToProps({ routing }) {
  const query = qs.parse(routing.location.search).q;
  return {
    query
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateQuery: bindActionCreators(navigate.updateQuery, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SearchBarContainer
);