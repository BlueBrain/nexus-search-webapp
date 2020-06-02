import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexusContext } from '@bbp/react-nexus';
import { Spin, Checkbox } from 'antd';
import { labelOf } from '../utils';
import { FilterParams } from '../utils/queryBuilder';
import { uniq, remove } from 'lodash';

export type FilterBucket = {
  count: number;
  key: string;
};

// TODO this should be in a sep. file
const SearchFiltersComponent: React.FC<{
  loading: boolean;
  error: Error | null;
  data: any | null;
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
}> = ({ loading, error, data, filters, onChange }) => {
  // TODO Break into utils
  const filterItems = Object.keys(data?.aggregations || {})
    .map(filterKey => {
      return {
        filterKey,
        buckets: data?.aggregations[filterKey].buckets.map((bucket: any) => ({
          count: bucket.doc_count,
          key: bucket.key,
        })),
      };
    })
    .filter(({ buckets }) => buckets.length > 0);

  // TODO post
  return (
    <Spin spinning={loading}>
      {filterItems.map(({ filterKey, buckets }, index) => {
        return (
          <div style={{ padding: '1rem' }}>
            <h4>{filterKey}</h4>
            <br />
            {buckets.map((bucket: FilterBucket) => {
              const isChecked = filters[filterKey]?.indexOf(bucket.key) >= 0;
              return (
                <div>
                  <p style={{ marginBottom: '1rem' }}>
                    <Checkbox
                      checked={isChecked}
                      onChange={({ target: { checked } }) => {
                        return checked
                          ? // Add bucket key value (like "ElasticSearchView")
                            // to Filter List (like "@type")
                            onChange({
                              ...filters,
                              [filterKey]: uniq([
                                ...(filters[filterKey] || []),
                                bucket.key,
                              ]),
                            })
                          : // remove bucket key value (like "ElasticSearchView")
                            // to Filter List (like "@type")
                            onChange({
                              ...filters,
                              [filterKey]: (filters[filterKey] || []).filter(
                                element => element !== bucket.key
                              ),
                            });
                      }}
                    >
                      <b>{bucket.count}</b> {labelOf(bucket.key)}
                    </Checkbox>
                  </p>
                </div>
              );
            })}
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
  const aggregations = Object.keys(properties).reduce(
    (memo, propertyKey) => {
      // If it's a keyword, then we
      if (
        properties[propertyKey]?.type === 'keyword' &&
        propertyKey !== '@id' &&
        propertyKey !== '_self'
      ) {
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
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
}> = ({
  searchConfig: { key, orgLabel, projectLabel, view, mappings },
  filters,
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
    const query = generateAggregatedQueryFromElasticSearchMapping(mappings);
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
      filters={filters}
      onChange={onChange}
    />
  );
};

export default SearchFiltersContainer;
