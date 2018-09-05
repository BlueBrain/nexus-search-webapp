import React from "react";
import Paginate from "./Pagination";
import { Spin } from "antd";
import ListFormats from "./Format";

const ResultsFound = ({ pending, results, hits, pageParams, listType }) => {
  const MySlectedListFormatType = ListFormats[listType];
  if (!MySlectedListFormatType) {
    throw new Error("There is no list format component of type: " + listType);
  }
  return (
    <React.Fragment>
      <Spin spinning={pending} size="large" wrapperClassName={"big-loader"}>
        <div id="search-results" className={listType.toLowerCase()}>
          <MySlectedListFormatType results={results} />
        </div>
      </Spin>
      {hits - results.length > 0 &&
        Paginate({ totalPages: Math.floor(hits / pageParams.pageSize), ...pageParams })}
    </React.Fragment>
  );
};
export default ResultsFound;
