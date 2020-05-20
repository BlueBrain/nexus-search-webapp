import * as React from 'react';
import Search from 'antd/lib/input/Search';

const SearchTextContainer: React.FC = () => {
  return (
    <div>
      <Search
        placeholder="input search text"
        onSearch={value => console.log(value)}
        style={{ width: 200 }}
      />
    </div>
  );
};

export default SearchTextContainer;
