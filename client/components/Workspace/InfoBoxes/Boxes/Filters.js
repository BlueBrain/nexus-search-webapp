import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon } from "antd";
import { search } from "../../../../store/actions";

const FiltersBoxComponent = (props) => {
  let { onDismiss, filter, type, q, removeFacet } = props;
  return (
    <div className="info-box filters-box">
      <a className="close" onClick={onDismiss}><span>Clear All{" "}</span><Icon type="close" /></a>
      <h3>Selected Filters</h3>
      <ul className="filters">
        {Object.keys(filter).map(key => {
          return (
            <li className="selected-filter" key={key}>
              <span className="filter-label">{key}</span>
              {filter[key].map(selectedFilterName => {
                return (
                  <a key={selectedFilterName} className="selected-subfilter" onClick={() => removeFacet(key, selectedFilterName)}>
                   <div className="subfilter-label"><span>{selectedFilterName}</span></div>
                   <span className="close"><Icon type="close" /></span>
                  </a>
                );
              })}
            </li>
          )
        })}
      </ul>
    </div>
  );
};

class FiltersBoxContainer extends React.PureComponent {
  removeFacet (key, filterName) {
    // TODO implement centralized filter locations
    let filter = this.props.filter;
    filter[key] = filter[key].filter(name => name !== filterName);
    if (filter[key].length === 0) {
      delete filter[key];
    }
    this.props.updateSearchParams({ filter })
  }
  handleDismiss () {
    this.props.onDismiss();
    this.props.updateSearchParams({ type: null, filter: null, query: null, sort: null });
  }
  render() {
    const onDismiss = this.handleDismiss.bind(this);
    const removeFacet = this.removeFacet.bind(this);
    return FiltersBoxComponent({ ...this.props, onDismiss, removeFacet });
  }
}

FiltersBoxContainer.propTypes = {
  updateSearchParams: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

function mapStateToProps({ search }) {
  const { q, type, filter } = search;
  return {
    type,
    q,
    filter: {...filter}
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersBoxContainer);

