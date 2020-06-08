import * as React from 'react';

import SourceItem from './SourceItem';

import './LiteratureSearchResultsTable.less';

const LiteratureSearchResultsTable: React.FC<{ data: any }> = ({ data }) => {
  if (data && data.hits && data.hits.hits) {
    const sources = data.hits.hits;
    const totalSources = data.hits.total.value;

    return (
      <div className="lit-search">
        <h4>Total: {totalSources}</h4>
        {sources.map((source: any) => (
          <SourceItem source={source} />
        ))}
      </div>
    );
  }

  return null;
};

export default LiteratureSearchResultsTable;
