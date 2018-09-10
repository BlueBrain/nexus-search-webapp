import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon } from "antd";
import { search } from "../../../../store/actions";

const FiltersBoxComponent = props => {
  let { onDismiss, filter, type, q, removeFacet, removeQuery } = props;
  return (
    <div className="info-box filters-box">
      <a className="close" onClick={onDismiss}>
        <span>Clear All </span>
        <Icon type="close" />
      </a>
      <h3>Selected Filters</h3>
      <ul className="filters">
        {q && (
          <li className="selected-filter" key="query">
            <span className="filter-label">Search Term</span>
            <a key="query" className="selected-subfilter" onClick={removeQuery}>
              <div className="subfilter-label">
                <span>{q}</span>
              </div>
              <span className="close">
                <Icon type="close" />
              </span>
            </a>
          </li>
        )}
        {Object.keys(filter).map(key => {
          return (
            <li className="selected-filter" key={key}>
              <span className="filter-label">{key}</span>
              {filter[key].map(selectedFilterName => {
                return (
                  <a
                    key={selectedFilterName}
                    className="selected-subfilter"
                    onClick={() => removeFacet(key, selectedFilterName)}
                  >
                    <div className="subfilter-label">
                      <span>{selectedFilterName}</span>
                    </div>
                    <span className="close">
                      <Icon type="close" />
                    </span>
                  </a>
                );
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

class FiltersBoxContainer extends React.PureComponent {
  removeFacet(key, filterName) {
    // TODO implement centralized filter locations
    let filter = this.props.filter;
    filter[key] = filter[key].filter(name => name !== filterName);
    if (filter[key].length === 0) {
      delete filter[key];
    }
    this.props.updateSearchParams({ filter });
  }
  removeQuery() {
    this.props.updateSearchParams({ q: null });
  }
  handleDismiss() {
    this.props.onDismiss();
    this.props.updateSearchParams({
      type: null,
      filter: null,
      q: null,
      sort: null
    });
  }
  render() {
    const onDismiss = this.handleDismiss.bind(this);
    const removeFacet = this.removeFacet.bind(this);
    const removeQuery = this.removeQuery.bind(this);
    return FiltersBoxComponent({
      ...this.props,
      onDismiss,
      removeFacet,
      removeQuery
    });
  }
}

FiltersBoxContainer.propTypes = {
  updateSearchParams: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired
};

function mapStateToProps({ search }) {
  const { q, type, filter } = search;
  return {
    type,
    q,
    filter: { ...filter }
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
)(FiltersBoxContainer);
