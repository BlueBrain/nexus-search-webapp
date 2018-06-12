import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Spin, Icon, Card } from "antd";
import { types, navigate } from "../../store/actions";
import TypeIcon from "../TypeIcon";
import qs from 'query-string';


const Type = ({ color, label, value, icon, amount, onSelect, onHover }) => {
  return (
      <div key={value} className="type" onMouseLeave={() => onHover(null)} onMouseEnter={() => onHover(value)} onClick={() => onSelect(value)}>
        <Card>
          <div className="flex space-between"><TypeIcon iconURL={icon} color={color} /><span style={{flexGrow: 1, padding: '0 1em'}}>{label}</span><span style={{color: '#80808094'}}>{amount}</span></div>
        </Card>
      </div>
  )
}

const TypesComponent = ({ pending, types, onHover, onSelect, clearTypes }) => (
  <div id="types">
    <div className="filter-title flex space-between">
      <p>Categories</p>
      <a onClick={clearTypes}>clear filters</a>
    </div>
    {pending && <div className="filter-title flex center" style={{width:"100%", margin: "40px auto"}}><Spin /></div>}
    {types &&
      types.map(props => Type({ onSelect, onHover, ...props }))}
    <div className="filter-title flex space-between">
      <a onClick={clearTypes}>see more <Icon type="down"/></a>
    </div>
  </div>
);

TypesComponent.propTypes = {
  clearTypes: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  types: PropTypes.any.isRequired
};

class TypesContainer extends React.PureComponent {
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
  clearTypes () {
    this.props.updateQuery({ type: null });
  }
  render() {
    const { pending, error, types, selectedType } = this.props;
    const onSelect = this.onSelect.bind(this);
    const clearTypes = this.clearTypes.bind(this);
    const onHover = this.onHover.bind(this);
    return TypesComponent({ pending, error, types, onSelect, selectedType, clearTypes, onHover });
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
