import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as SearchSnippetCards from "../../../Cards";
import { getProp } from "@libs/utils";

const Grid = ({ results, types }) => {
  return (
    <React.Fragment>
      {results.map((result, index) => {
        let resultType = getProp(result, "_source.@type");
        let typeLabel = getProp(types[resultType] || {}, "label");
        let SearchSnippet =
          SearchSnippetCards[typeLabel.replace(" ", "")] ||
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
    const { results, types } = this.props;
    return Grid({ results, types });
  }
}

GridContainer.propTypes = {
  results: PropTypes.any,
  types: PropTypes.any
};

function mapStateToProps({ config }) {
  let { types } = config.uiConfig;
  return {
    types
  };
}

export default connect(mapStateToProps)(GridContainer);
