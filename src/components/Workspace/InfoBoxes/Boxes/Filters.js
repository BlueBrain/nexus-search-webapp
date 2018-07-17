import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon } from "antd";
import getQueryFromUrl from "../../../../libs/query";
import { navigate } from "../../../../store/actions";

const FiltersBoxComponent = (props) => {
  let { onDismiss, filter, selectedType, queryTerm, removeFacet } = props;
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
                   <span className="subfilter-label">{selectedFilterName}</span>
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
    this.props.updateQuery({ filter })
  }
  handleDismiss () {
    this.props.onDismiss();
    this.props.updateQuery({ type: null, filter: null, query:null });
  }
  render() {
    const onDismiss = this.handleDismiss.bind(this);
    const removeFacet = this.removeFacet.bind(this);
    return FiltersBoxComponent({ ...this.props, onDismiss, removeFacet });
  }
}

FiltersBoxContainer.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};

function mapStateToProps({ routing }) {
  const { selectedType, queryTerm, selectedFacets } = getQueryFromUrl(routing);
  return {
    selectedType,
    queryTerm,
    filter: selectedFacets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateQuery: bindActionCreators(navigate.updateQuery, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersBoxContainer);

