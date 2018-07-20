import React from "react";
import { navigate } from "../store/actions";
import { Button, Input, Icon, Radio } from 'antd';
import qs from 'query-string';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const { Search } = Input;


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
  let queryParams = qs.parse(routing.location.search);
  const query = queryParams? queryParams.q : null;
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