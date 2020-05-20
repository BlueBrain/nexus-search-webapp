import * as React from 'react';
import { Table } from 'antd';
import { useLocation, useHistory, useParams } from 'react-router';

const SearchResultsContainer: React.FC<{
  results: any;
}> = ({ results }) => {
  const history = useHistory();
  const location = useLocation();

  // TODO: get from somewhere
  const orgLabel = 'public';
  const projectLabel = 'graphql-ld';

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

  console.log(data);

  return (
    <div>
      <h3>Total: {results?.hits?.total?.value || 'None'}</h3>
      <Table bordered columns={columns} dataSource={data} />
    </div>
  );
};

export default SearchResultsContainer;
