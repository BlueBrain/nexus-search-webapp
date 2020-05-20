import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexusContext } from '@bbp/react-nexus';
import { Spin } from 'antd';

const SearchFiltersComponent: React.FC<{
  loading: boolean;
  error: Error | null;
  data: any | null;
  onChange: (filters: any) => void;
}> = ({ loading, error, data, onChange }) => {
  const filters = Object.keys(data?.aggregations || {}).map(filterKey => {
    return data?.aggregations[filterKey].buckets.map((bucket: any) => ({
      count: bucket.doc_count,
      key: bucket.key,
    }));
  });

  return (
    <Spin spinning={loading}>
      {filters.map((filter, index) => {
        const title = Object.keys(data?.aggregations || {})[index];
        return (
          <div>
            <h4>{title}</h4>
            <br />
            {filter.map((bucket: any) => (
              <div>
                <label>
                  {bucket.key} {bucket.count}
                </label>{' '}
                <input type="checkbox"></input>
              </div>
            ))}
          </div>
        );
      })}
    </Spin>
  );
};

const SearchFiltersContainer: React.FC<{
  searchConfig: SearchConfig;
  onChange: (filters: any) => void;
}> = ({
  searchConfig: { key, orgLabel, projectLabel, view, mappings },
  onChange,
}) => {
  const nexus = useNexusContext();
  const [{ loading, error, data }, setData] = React.useState<{
    loading: boolean;
    error: Error | null;
    data: any | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  React.useEffect(() => {
    setData({
      loading: true,
      error: null,
      data: null,
    });
    nexus.View.elasticSearchQuery(
      orgLabel,
      projectLabel,
      encodeURIComponent(view),
      {
        aggs: {
          // from mapping example
          // "@type": {
          //   "type": "keyword",
          //   "copy_to": "_all_fields"
          // },

          '@type': {
            terms: { field: '@type' },
          },
        },
      }
    )
      .then(elasticSearchResponse => {
        setData({
          error: null,
          loading: false,
          data: elasticSearchResponse,
        });
      })
      .catch(error => {
        setData({
          error,
          loading: false,
          data: null,
        });
      });
  }, [key]);

  return (
    <SearchFiltersComponent
      data={data}
      loading={loading}
      error={error}
      onChange={onChange}
    />
  );
};

export default SearchFiltersContainer;
