import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexusContext } from '@bbp/react-nexus';
import { Spin, Checkbox } from 'antd';
import { labelOf } from '../utils';

// TODO this should be in a sep. file
const SearchFiltersComponent: React.FC<{
  loading: boolean;
  error: Error | null;
  data: any | null;
  onChange: (filters: any) => void;
}> = ({ loading, error, data, onChange }) => {
  // TODO Break into utils
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
          <div style={{ padding: '1rem' }}>
            <h4>{title}</h4>
            <br />
            {filter.map((bucket: any) => (
              <div>
                <p style={{ marginBottom: '1rem' }}>
                  <Checkbox checked={false} onChange={onChange}>
                    <b>{bucket.count}</b> {labelOf(bucket.key)}
                  </Checkbox>
                </p>
              </div>
            ))}
          </div>
        );
      })}
    </Spin>
  );
};

const generateAggregatedQueryFromElasticSearchMapping = (
  mappings: SearchConfig['mappings']
) => {
  const properties = mappings?.properties || {};
  console.log({ properties });
  const aggregations = Object.keys(properties).reduce(
    (memo, propertyKey) => {
      // If it's a keyword, then we
      if (properties[propertyKey]?.type === 'keyword') {
        memo[propertyKey] = {
          terms: { field: propertyKey },
        };
      }
      return memo;
    },
    {} as {
      [propertyKey: string]: {
        terms: {
          field: string;
        };
      };
    }
  );
  return {
    aggs: aggregations,
  };
};

const SearchFiltersContainer: React.FC<{
  searchConfig: SearchConfig;
  onChange: (filters: any) => void;
}> = ({
  searchConfig: { key, orgLabel, projectLabel, view, mappings },
  onChange,
}) => {
  const nexus = useNexusContext();
  console.log({ mappings });
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
    const query = generateAggregatedQueryFromElasticSearchMapping(mappings);
    console.log(query);
    nexus.View.elasticSearchQuery(
      orgLabel,
      projectLabel,
      encodeURIComponent(view),
      query
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
