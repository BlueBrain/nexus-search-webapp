import * as React from 'react';
import { Table } from 'antd';
import { useLocation, useHistory } from 'react-router';
import { Pagination } from '../utils/queryBuilder';
import { SearchConfig } from './SearchConfigContainer';
import { PaginationConfig } from 'antd/lib/table';

const SearchResultsContainer: React.FC<{
  results: any;
  searchConfig: SearchConfig;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
}> = ({ results, searchConfig, pagination, setPagination }) => {
  const history = useHistory();
  const location = useLocation();

  const { orgLabel, projectLabel } = searchConfig;

  const goToResource = (resourceId: string) => {
    const pushRoute = `/${orgLabel}/${projectLabel}/resources/${encodeURIComponent(
      resourceId
    )}`;
    history.push(pushRoute, location.state);
  };

  const columns = [
    {
      title: 'Resource Id',
      dataIndex: 'id',
      key: 'id',
      render: (resourceId: string) => (
        <a onClick={() => goToResource(resourceId)}>{resourceId}</a>
      ),
    },
  ];

  const data =
    results &&
    results.hits.hits.map((result: any) => {
      return {
        key: result._id,
        id: result._id,
      };
    });

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
    <div>
      <h3>Total: {results?.hits?.total?.value || 'None'}</h3>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        pagination={paginationConfig}
      />
    </div>
  );
};

export default SearchResultsContainer;
