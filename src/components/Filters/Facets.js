import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Checkbox, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;

const FacetTitle = ({ children }) => (
  <h3 className="facet-title">{children}</h3>
)

const FacetBody = ({ children }) => (
  <div className="facet-body">{children}</div>
)

const Facet = ({ label, value, amount }) => (
  <Row>
  <Col span={3}><Checkbox value={value}></Checkbox></Col>
  <Col span={12}>{label}{value}</Col>
  <Col span={8}>{amount}</Col>
  </Row>
)


const FacetGroup = (facet, onSelect ) => {
  const { title, facetOptions } = facet
  console.log('in facetGroup', title, facetOptions);
  return <li className="facet-group">
      <FacetTitle>{title}</FacetTitle>
      <FacetBody>
      <CheckboxGroup style={{ width: '100%' }} onChange={onSelect}>
        {facetOptions.map(({ label, value, selected, amount }, index) => (
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
};

// FacetGroup.propTypes = {
//   onSelect: PropTypes.func.isRequired,
//   facet: PropTypes.any.isRequired
// };


const FacetsComponent = ({ facets, category, onSelect }) => (
  <div className="facets title">
  <h2>Facets for {category}</h2>
    <ul>
      {facets.map(facet => FacetGroup(facet, onSelect))}
    </ul>
  </div>
)

FacetsComponent.propTypes = {
  onSelect: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  facets: PropTypes.any.isRequired
};

class FacetContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { facets, category } = this.props;
    const onSelect = this.props.selectFacet.bind(this)
    return FacetsComponent({ facets, category, onSelect })
  }
}

FacetContainer.propTypes = {
  // getFacetsByCategory: PropTypes.func.isRequired,
  selectFacet: PropTypes.func.isRequired,
  category: PropTypes.string,
  facets: PropTypes.any
};

function mapStateToProps({ query }) {
  const { facets, category } = query;
  return {
    facets, category
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectFacet: bindActionCreators(key => { console.log('selected facet:' , key)}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  FacetContainer
);