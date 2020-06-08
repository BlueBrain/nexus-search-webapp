import * as React from 'react';

import './SourceItem.less';

const PRETEXT_VALUE = 200;
const POSTTEXT_VALUE = 100;

const SourceItem: React.FC<{ source: any }> = ({ source }) => {
  const { text, section } = source?.inner_hits?.sentences?.hits?.hits[0]
    ?._source || {
    text: '',
    section: 'abstract',
  };

  const {
    title = 'No title',
    datePublished,
    abstract = 'Empty',
    author = [{ name: 'No author' }],
    sameAs = '', // this is the URL link provided by ES
  } = source._source;

  const sectionMatch = source._source[section];
  const matchIndex = sectionMatch?.indexOf(text);

  const makeTextPreview = () => {
    if (matchIndex && matchIndex >= 0) {
      const preText =
        sectionMatch?.substring(
          matchIndex - PRETEXT_VALUE < 0 ? 0 : matchIndex - PRETEXT_VALUE,
          matchIndex
        ) || '';
      const postText =
        sectionMatch?.substring(
          matchIndex + text.length,
          matchIndex + text.length + POSTTEXT_VALUE
        ) || '';
      return (
        <p>
          {preText}
          <span className="highlighted">
            <b>
              <em>{text}</em>
            </b>
          </span>
          {postText}
        </p>
      );
    }
    return <p className={`abstract collapsed`}>{abstract}</p>;
  };

  return (
    <div className="source-item">
      <h3>
        <a href={sameAs} target="_blank">
          {title}
        </a>
      </h3>
      <h4>{datePublished}</h4>
      {makeTextPreview()}
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
