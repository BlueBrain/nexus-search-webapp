import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexus, useNexusContext } from '@bbp/react-nexus';
import { SearchResponse } from 'elasticsearch';
import { FilterParams, ESQueryParams } from '../utils/queryBuilder';

const SearchQueryContainer: React.FC<{
  searchConfig: SearchConfig;
  searchText?: string;
  filters: FilterParams;
  children: React.FC<{
    loading: boolean;
    error: Error | null;
    data: SearchResponse<any>;
  }>;
}> = ({ children, searchConfig, searchText, filters }) => {
  const { orgLabel, projectLabel, view, key, searchMethod } = searchConfig;
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

    const esQueryParams: ESQueryParams = {
      q: searchText,
      filter: filters,
    };
    console.log('search', { filters });

    searchMethod(esQueryParams, searchConfig, nexus)
      .then((elasticSearchResponse: any) => {
        setData({
          error: null,
          loading: false,
          data: elasticSearchResponse,
        });
      })
      .catch((error: Error) => {
        setData({
          error,
          loading: false,
          data: null,
        });
      });
  }, [key, searchText, filters]);

  return !!children
    ? children({
        loading,
        error,
        data,
      })
    : null;
};

export default SearchQueryContainer;
