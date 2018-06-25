import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Spin, Icon, Card } from "antd";
import { types, navigate } from "../../store/actions";
import TypeIcon from "../TypeIcon";
import qs from 'query-string';


const Type = ({ selectedType, color, label, value, icon, amount, onSelect, onHover }) => {
  let selected = selectedType === value ? "selected" : "";
  return (
      <div key={value} className={"type " + selected} onMouseLeave={() => onHover(null)} onMouseEnter={() => onHover(value)} onClick={() => onSelect(value)}>
        <Card bodyStyle={selectedType === value ? { backgroundColor : "#b9e9d417"}: {}}>
          <div className="flex space-between"><TypeIcon iconURL={icon} color={color} /><span style={{flexGrow: 1, padding: '0 1em'}}>{label}</span><span style={{color: '#80808094'}}>{amount}</span></div>
        </Card>
      </div>
  )
}

const TypesComponent = ({ pending, selectedType, types, onHover, onSelect, clearFilters }) => (
  <div id="types">
    <div className="filter-title flex space-between">
      <p>Categories</p>
      <a onClick={clearFilters}>clear filters</a>
    </div>
    {pending && <div className="filter-title flex center" style={{width:"100%", margin: "40px auto"}}><Spin /></div>}
    {types &&
      types.map(props => Type({ onSelect, selectedType, onHover, ...props }))}
    <div className="filter-title flex space-between">
      <a onClick={clearFilters}>see more <Icon type="down"/></a>
    </div>
  </div>
);

TypesComponent.propTypes = {
  clearFilters: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  types: PropTypes.any.isRequired
};

class TypesContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchTypes(this.props.query);
  }
  componentDidUpdate (props) {
    if (props.query !== this.props.query) {
      this.props.fetchTypes(this.props.query);
    }
  }
  onSelect (value) {
    this.props.updateQuery({ type: value });
  }
  onHover (value) {
    this.props.hoverType(value);
  }
  clearFilters () {
    this.props.updateQuery({ type: null, filter: null, query:null });
  }
  render() {
    const { pending, error, types, selectedType } = this.props;
    const onSelect = this.onSelect.bind(this);
    const clearFilters = this.clearFilters.bind(this);
    const onHover = this.onHover.bind(this);
    return TypesComponent({ pending, error, types, onSelect, selectedType, clearFilters, onHover });
  }
}

TypesContainer.propTypes = {
  fetchTypes: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  error: PropTypes.any,
  query: PropTypes.string,
  selectedType: PropTypes.string,
  types: PropTypes.any.isRequired
};

function mapStateToProps({ types: typeData, routing }) {
  const { pending, error, types } = typeData;
  const queryTerm = qs.parse(routing.location.search).q;
  const selectedType = qs.parse(routing.location.search).type;
  return {
    query: queryTerm,
    selectedType,
    pending,
    error,
    types
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateQuery: bindActionCreators(navigate.updateQuery, dispatch),
    fetchTypes: bindActionCreators(types.fetchTypes, dispatch),
    hoverType: bindActionCreators(types.updateHoverType, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TypesContainer);
