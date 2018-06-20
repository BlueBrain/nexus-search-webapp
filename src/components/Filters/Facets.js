import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Spin, Checkbox, Row, Col } from "antd";
import { facets, navigate } from "../../store/actions";
import qs from "query-string";
import { truthy } from "../../libs/utils";
const CheckboxGroup = Checkbox.Group;

const FacetTitle = ({ title, total }) => (
  <div className="filter-title flex space-between">
    <p>{title}</p>
    <span style={{color: 'rgba(128, 128, 128, 0.58)'}}>{total}</span>
  </div>
);

const FacetBody = ({ children }) => (
  <div className="facet-body">{children}</div>
);

const Facet = ({ label, value, amount, selected }) => {
  return (
  <Row>
    <Col span={3}>
      <Checkbox value={value} checked={true}/>
    </Col>
    <Col span={12}>
      {label}
      {value}
    </Col>
    <Col span={8}>{amount}</Col>
  </Row>
);
}
const FacetGroup = (facet, onSelect) => {
  const { title, total, facetOptions, selected } = facet;
  return (
    <li key={title} className="facet-group">
      <FacetTitle title={title} total={total} />
      <FacetBody>
        <CheckboxGroup style={{ width: "100%" }} defaultValue={selected} onChange={value => onSelect(title, value)}>
          {facetOptions && !!facetOptions.length && facetOptions.map(({ label, value, amount, selected }, index) => (
            <Facet
              key={`${label}-${index}`}
              name={name}
              value={value}
              selected={selected}
              amount={amount}
            />
          ))}
        </CheckboxGroup>
      </FacetBody>
    </li>
  );
};

// FacetGroup.propTypes = {
//   onSelect: PropTypes.func.isRequired,
//   facet: PropTypes.any.isRequired
// };

const FacetsComponent = ({ facets, pending, selectedType, onSelect }) => (
  <div id="facets">
    {pending && (
      <div className="filter-title flex center" style={{width:"100%", margin: "40px auto"}}><Spin /></div>
    )}
    {!pending &&
      facets &&
      !!facets.length && (
        <div>
          <ul>{facets.map(facet => FacetGroup(facet, onSelect))}</ul>
        </div>
      )}
  </div>
);

FacetsComponent.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedType: PropTypes.string.isRequired,
  facets: PropTypes.any.isRequired,
  pending: PropTypes.bool
};

class FacetContainer extends React.Component {
  state = { facet: {} };
  componentDidMount() {
    this.props.fetchFacets(this.props.selectedType, this.props.queryTerm);
  }
  componentDidUpdate (props) {
    if (props.selectedType !== this.props.selectedType) {
      this.props.fetchFacets(this.props.selectedType, this.props.queryTerm);
    }
    if (props.queryTerm !== this.props.queryTerm) {
      this.props.fetchFacets(this.props.selectedType, this.props.queryTerm);
    }
  }
  onSelect (key, value) {
    let { facet } = this.state;
    facet[key] = value;
    this.setState({ facet: truthy(facet) }, () => {
      this.props.updateQuery({ filter: this.state.facet });
    });
  }
  render() {
    const onSelect = this.onSelect.bind(this);
    return FacetsComponent({ onSelect, ...this.props });
  }
}

FacetContainer.propTypes = {
  fetchFacets: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  selectedFacets: PropTypes.any,
  selectedType: PropTypes.string,
  queryTerm: PropTypes.string,
  facets: PropTypes.any,
  pending: PropTypes.bool,
  error: PropTypes.any
};

function mapStateToProps({ facets, routing }) {
  const { results } = facets;
  const selectedType = qs.parse(routing.location.search).type;
  const queryTerm = qs.parse(routing.location.search).q;
  const selectedFacets = JSON.parse(qs.parse(routing.location.search).filter || "{}");
  if (selectedFacets) {
    results.map(facet => {
      let selectedFacet = selectedFacets[facet.title];
      if (selectedFacet) {
        facet.selected = selectedFacet;
        facet.facetOptions.map(facetOption => {
          if (selectedFacet.indexOf(facetOption.value) >= 0) {
            facetOption.selected = true;
          }
          return facetOption;
        })
      }
      return facet;
    });
  }
  return {
    selectedType,
    selectedFacets,
    queryTerm,
    facets: results,
    ...facets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateQuery: bindActionCreators(navigate.updateQuery, dispatch),
    fetchFacets: bindActionCreators(facets.fetchFacets, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetContainer);
