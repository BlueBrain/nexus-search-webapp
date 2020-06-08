import * as React from 'react';
import { Pagination } from 'antd';
import { PaginationConfig } from 'antd/lib/table';

import SourceItem from './SourceItem';

import './LiteratureSearchResultsTable.less';

const LiteratureSearchResultsTable: React.FC<{
  data: any;
  pagination: any;
  setPagination: (pagination: any) => void;
}> = ({ data, pagination, setPagination }) => {
  if (data && data.hits && data.hits.hits) {
    const sources = data.hits.hits;

    const paginationConfig: PaginationConfig = {
      total: data.hits.total.value || 0,
      current: Math.floor(pagination.from / pagination.size) + 1,
      pageSize: pagination.size,
      onChange: (page: number, pageSize?: number) => {
        const size = pageSize || pagination.size;
        setPagination({
          size,
          from: page * size - size,
        });
      },
      onShowSizeChange: (current, size) => {
        setPagination({
          size,
          from: current * size - size,
        });
      },
    };

    return (
      <div className="lit-search">
        <h4>Total: {paginationConfig.total}</h4>
        {sources.map((source: any) => (
          <SourceItem source={source} />
        ))}
        <Pagination showSizeChanger {...paginationConfig} />
      </div>
    );
  }

  return null;
};

export default LiteratureSearchResultsTable;
