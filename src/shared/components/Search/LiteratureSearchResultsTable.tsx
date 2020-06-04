import * as React from 'react';

import './LiteratureSearchResultsTable.less';

const LiteratureSearchResultsTable: React.FC<{ data: any }> = ({ data }) => {
  console.log('data', data);

  if (data && data.hits && data.hits.hits) {
    const sources = data.hits.hits;

    return sources.map((source: any) => (
      <div className="ls-search-source">
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
    ));
  }

  return null;
};

export default LiteratureSearchResultsTable;
