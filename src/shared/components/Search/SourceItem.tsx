import * as React from 'react';
import { Button } from 'antd';

import './SourceItem.less';

const SourceItem: React.FC<{ source: any }> = ({ source }) => {
  const [expanded, setExpanded] = React.useState(false);

  const {
    title = 'No title',
    datePublished,
    abstract = 'Empty',
    author = [{ name: 'No author' }],
  } = source._source;

  return (
    <div className="source-item">
      <h3>
        {/* display full article onClick? */}
        <a href="">{title}</a>
      </h3>
      <h4>{datePublished}</h4>
      <p className={`abstract ${!expanded && 'collapsed'}`}>{abstract}</p>
      <Button onClick={() => setExpanded(!expanded)} type="link">
        {expanded ? 'Collapse' : 'Show more...'}
      </Button>
      <h4>
        {author &&
          author.map((author: any) => (
            <span className="author">{author.name}</span>
          ))}
      </h4>
    </div>
  );
};

export default SourceItem;
