import * as React from 'react';

const SearchResultsContainer: React.FC<{
  results: any;
}> = ({ results }) => {
  return (
    <div>
      <h3>Total: {results?.hits?.total?.value || 'None'}</h3>
      <code>{JSON.stringify(results, null, 2)}</code>
    </div>
  );
};

export default SearchResultsContainer;
