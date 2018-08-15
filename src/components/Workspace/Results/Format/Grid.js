import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as SearchSnippetCards from "../../../Cards";

const Grid = ({ results }) => {
  return (
    <React.Fragment>
      {results.map((result, index) => {
        let SearchSnippet =
          SearchSnippetCards[result._source["@type"]] ||
          SearchSnippetCards.Default;
        return (
          <SearchSnippet
            key={`${result._source["@id"]}-${index}`}
            // TODO remove this assignment when urls are resolvable within nexus
            value={Object.assign(result._source, { _id: result._id })}
            id={result._id}
            openVisualizer={() => {}}
          />
        );
      })}
    </React.Fragment>
  );
};

class GridContainer extends React.PureComponent {
  render() {
    const { results } = this.props;
    return Grid({ results });
  }
}

GridContainer.propTypes = {
  results: PropTypes.any
};

function mapStateToProps({}) {
  return {};
}

export default connect(mapStateToProps)(GridContainer);
