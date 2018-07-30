import React from "react";
import ResultsFound from "./Found";
import ResultsNotFound from "./NotFound";

const ResultsComponent = (
  { pending, results, hits, api, hoverType, types, listType },
  pageParams
) => {
  return (
    <div className="center grow full full-height column">
      {!!results.length && ResultsFound({ pending, results, hits, pageParams, listType })}
      {!results.length && !pending && ResultsNotFound()}
    </div>
  );
};

export default ResultsComponent;
