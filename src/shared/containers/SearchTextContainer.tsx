import * as React from 'react';
import Search from 'antd/lib/input/Search';

const SearchTextContainer: React.FC<{
  onChange?: (value: string) => void;
}> = ({ onChange }) => {
  return (
    <div>
      <Search
        placeholder="input search text"
        onSearch={value => onChange && onChange(value)}
      />
    </div>
  );
};

export default SearchTextContainer;
