import * as React from 'react';

import './LiteratureSearchResultsTable.less';

const LiteratureSearchResultsTable: React.FC<{ data: any }> = ({ data }) => {
  if (data && data.hits && data.hits.hits) {
    const sources = data.hits.hits;

    return (
      <div className="lit-search">
        <h4>Total: {data.hits.total.value}</h4>
        {sources.map((source: any) => (
          <div className="source">
            <h3>{source._source.title}</h3>
            <h4>{source._source.datePublished}</h4>
            <p>{source._source.abstract}</p>
            <h4>
              {source._source.author &&
                source._source.author.map((author: any) => (
                  <span className="author">{author.name}</span>
                ))}
            </h4>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LiteratureSearchResultsTable;
