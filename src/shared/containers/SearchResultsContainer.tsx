import * as React from 'react';

const SearchResultsContainer: React.FC<{
  results: any;
}> = ({ results }) => {
  return <div>{JSON.stringify(results, null, 2)}</div>;
};

export default SearchResultsContainer;
