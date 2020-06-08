import * as React from 'react';
import { Pagination } from '../utils/queryBuilder';
import { SearchConfig } from './SearchConfigContainer';
import LiteratureSearchResultsTable from '../components/Search/LiteratureSearchResultsTable';

const LitSearchResultsContainer: React.FC<{
  results: any;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
}> = ({ results, pagination, setPagination }) => {
  return (
    <LiteratureSearchResultsTable
      data={results}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
};

export default LitSearchResultsContainer;
