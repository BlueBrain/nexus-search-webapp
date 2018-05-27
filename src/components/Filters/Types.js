import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Spinner } from "@bbp/nexus-react";
import { connect } from "react-redux";
import { Checkbox, Row, Col, Spin, Tree, Icon } from "antd";
import { types, navigate } from "../../store/actions";
import icons from "../Icons";
import SVG from "react-svg";
import qs from 'query-string';

const DEFAULT_TYPE_ICON_KEY = "cube";

const { TreeNode } = Tree;

const TypeIcon = ({iconURL}) => (
  <SVG
    path={icons[iconURL] || icons[DEFAULT_TYPE_ICON_KEY]}
    svgClassName="svg-class-name"
    className="tree"
  />
);

const TypesComponent = ({ pending, types, onSelect, clearTypes }) => (
  <div className="facets title">
    <a onClick={clearTypes}>clear filters</a>
    {pending && <Spin />}
    {types &&
      types.map(({ label, value, icon, amount }) => (
        <button key={value} onClick={() => onSelect(value)}><TypeIcon iconURL={icon} /> {label}{"   "}{amount}</button>
      ))}
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
  clearTypes () {
    this.props.updateQuery({ type: null });
  }
  render() {
    const { pending, error, types, selectedType } = this.props;
    const onSelect = this.onSelect.bind(this);
    const clearTypes = this.clearTypes.bind(this);
    return TypesComponent({ pending, error, types, onSelect, selectedType, clearTypes });
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
    fetchTypes: bindActionCreators(types.fetchTypes, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TypesContainer);
