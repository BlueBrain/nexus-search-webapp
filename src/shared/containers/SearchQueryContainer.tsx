import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexus, useNexusContext } from '@bbp/react-nexus';
import { SearchResponse } from 'elasticsearch';
import { FilterParams } from '../utils/queryBuilder';

const SearchQueryContainer: React.FC<{
  searchConfig: SearchConfig;
  searchText?: string;
  filters?: FilterParams;
  children: React.FC<{
    loading: boolean;
    error: Error | null;
    data: SearchResponse<any>;
  }>;
}> = ({
  children,
  searchConfig: { orgLabel, projectLabel, view, key },
  searchText,
  filters,
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
    nexus.View.elasticSearchQuery<SearchResponse<any>>(
      orgLabel,
      projectLabel,
      encodeURIComponent(view),
      // We need to combine the props
      // to create a beautiful ES query
      {
        ...(searchText
          ? {
              query: {
                query_string: {
                  query: searchText,
                },
              },
            }
          : {}),
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
  }, [key, searchText]);

  return !!children
    ? children({
        loading,
        error,
        data,
      })
    : null;
};

export default SearchQueryContainer;
