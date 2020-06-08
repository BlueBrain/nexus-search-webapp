import * as React from 'react';
import { Table } from 'antd';
import { useLocation, useHistory } from 'react-router';
import LiteratureSearchResultsTable from '../components/Search/LiteratureSearchResultsTable';

const SearchResultsContainer: React.FC<{
  results: any;
  searchConfig: any;
}> = ({ results, searchConfig }) => {
  const history = useHistory();
  const location = useLocation();

  const { orgLabel, projectLabel, key } = searchConfig;

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

  if (key === 'ls') {
    return <LiteratureSearchResultsTable data={results} />;
  }

  return (
    <div>
      <h3>Total: {results?.hits?.total?.value || 'None'}</h3>
      <Table bordered columns={columns} dataSource={data} />
    </div>
  );
};

export default SearchResultsContainer;
