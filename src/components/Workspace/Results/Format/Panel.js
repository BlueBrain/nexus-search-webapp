import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Panel = ({ results }) => {
  return (
    <React.Fragment>
      <p>Panel</p>
    {results.map((result, index) => {
      return <div>{result._source["@id"]}</div>;
    })}
    </React.Fragment>
  );
}

class PanelContainer extends React.PureComponent {
  render() {
    const { results } = this.props;
    return Panel({ results });
  }
}

PanelContainer.propTypes = {
  results: PropTypes.any,
};

function mapStateToProps({}) {
  return {
  };
}

export default connect(
  mapStateToProps
)(PanelContainer);