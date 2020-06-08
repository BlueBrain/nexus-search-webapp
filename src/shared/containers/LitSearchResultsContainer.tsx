import * as React from 'react';
import { Pagination } from '../utils/queryBuilder';
import { SearchConfig } from './SearchConfigContainer';
import { PaginationConfig } from 'antd/lib/table';
import LiteratureSearchResultsTable from '../components/Search/LiteratureSearchResultsTable';

const LitSearchResultsContainer: React.FC<{
  results: any;
  searchConfig: SearchConfig;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
}> = ({ results, pagination, setPagination }) => {
  const paginationConfig: PaginationConfig = {
    total: results?.hits?.total?.value || 0,
    current: Math.floor(pagination.from / pagination.size) + 1,
    pageSize: pagination.size,
    onChange: (page: number, pageSize?: number) => {
      const size = pageSize || pagination.size;
      console.log({ page, pageSize, size, pagination });
      setPagination({
        size,
        from: page * size - size,
      });
    },
  };

  console.log(paginationConfig, pagination);
  return (
    <LiteratureSearchResultsTable
      data={results}
      pagination={paginationConfig}
    />
  );
};

export default LitSearchResultsContainer;
