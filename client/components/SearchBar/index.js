import React from "react";
import { search } from "../../store/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SearchContainer from "./SearchContainer";
import { unCamelCase } from "@libs/string";

// TODO move to redux reducer
// TODO Searchbar should have its own filters request handled by redux?
// Altertinatively, it might be a feature and not a bug that filters
// are searchable only be the selected entity category eg Cell
function makeGroups(groupList, facet) {
  let groups = Object.keys(facet)
    .filter(key => key !== "doc_count" && key !== "key")
    .reduce((memo, key) => {
      let subFacet = facet[key];
      if (!subFacet.buckets) { return memo; }
      let children = subFacet.buckets.map(bucket => {
        return {
          key: `${facet.key},${bucket.key}`,
          filterKey: `${facet.key}.${key},${bucket.key}`,
          title: bucket.key,
          ...bucket
        };
      });
      let title = `${unCamelCase(facet.key)} ${unCamelCase(key)}`;
      let group = {
        title,
        key: facet.key,
        children
      };

      memo.push(group);
      return memo;
    }, []);
  return groupList.concat(groups);
}

function makeAutocompleteResultsWithQuery(facets = []) {
  return facets.reduce(makeGroups, []);
}

const DEFAULT_STATE = { value: "" };

class SearchBarContainer extends React.Component {
  state = DEFAULT_STATE;
  assignQuery() {
    const { value } = this.state;
    this.props.updateSearchParams({ q: value, from: 0 });
  }
  assignFilter(filterKey) {
    // TODO push this logic to a reducer called ("Update Single Filter") or so
    let [key, filterValue] = filterKey.split(",");
    let filter = this.props.selectedFilter;
    let targetFilter = filter[key];
    if (
      targetFilter &&
      Array.isArray(targetFilter) &&
      !targetFilter.filter(val => val === filterValue).length
    ) {
      targetFilter.push(filterValue);
    } else {
      filter[key] = [filterValue];
    }
    // // reset pagination after selecting new filters
    // // because we dont know how many entries we would get
    this.props.updateSearchParams({ filter, from: 0 });
  }
  onSearch(value) {
    this.setState({ value });
  }
  onSelect(value, option) {
    if (value === "all") {
      this.assignQuery();
    } else {
      let { filterkey: filterKey } = option.props;
      this.assignFilter(filterKey);
    }
    this.setState(DEFAULT_STATE);
  }
  onChange(value) {}
  render() {
    const { value } = this.state;
    const { autocompleteResults } = this.props;
    return SearchContainer({
      autocompleteResults,
      value,
      onSearch: this.onSearch.bind(this),
      onSelect: this.onSelect.bind(this),
      onChange: this.onChange.bind(this)
    });
  }
}

function mapStateToProps({ facets, search }) {
  const { results } = facets;
  const { filter, type, q } = search;
  return {
    selectedFilter: filter,
    autocompleteResults: makeAutocompleteResultsWithQuery(results)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBarContainer);
