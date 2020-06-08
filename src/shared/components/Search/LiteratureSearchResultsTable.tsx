import * as React from 'react';
import { Pagination } from 'antd';

import SourceItem from './SourceItem';

import './LiteratureSearchResultsTable.less';

const LiteratureSearchResultsTable: React.FC<{
  data: any;
  pagination?: any;
  onChangePage?: (page: number) => void;
  onChangePageSize?: (size: number) => void;
}> = ({ data, pagination, onChangePage, onChangePageSize }) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const onShowSizeChange = (current: any, pageSize: any) => {
    console.log(current, pageSize);
    // change page size here
    // onChangePageSize(pageSize);
  };

  const onClickChangePage = (page: any) => {
    console.log('data', data);
    // change page
    // onChangePage(page);
  };

  console.log('pagination', pagination);

  if (data && data.hits && data.hits.hits) {
    const sources = data.hits.hits;
    const totalSources = data.hits.total.value;

    return (
      <div className="lit-search">
        <h4>Total: {totalSources}</h4>
        {sources.map((source: any) => (
          <SourceItem source={source} />
        ))}
        <Pagination
          onChange={onClickChangePage}
          current={currentPage}
          total={totalSources}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
        />
      </div>
    );
  }

  return null;
};

export default LiteratureSearchResultsTable;
