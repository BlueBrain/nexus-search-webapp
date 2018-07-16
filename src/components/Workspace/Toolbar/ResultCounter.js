import React from "react";

const ResultCounter = ({ resultCount }) => {
  return (
    <div>
      <p>{!!resultCount && <span>{resultCount} results found</span>}</p>
    </div>
  );
};

export default ResultCounter;
