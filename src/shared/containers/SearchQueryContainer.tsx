import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexus, useNexusContext } from '@bbp/react-nexus';
import { SearchResponse } from 'elasticsearch';
import { FilterParams, ESQueryParams, Pagination } from '../utils/queryBuilder';

const SearchQueryContainer: React.FC<{
  searchConfig: SearchConfig;
  searchText?: string;
  pagination: Pagination;
  filters: FilterParams;
  children: React.FC<{
    loading: boolean;
    error: Error | null;
    data: SearchResponse<any>;
  }>;
}> = ({ children, searchConfig, searchText, filters, pagination }) => {
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

  const size = filters && filters.size ? filters.size : 5;
  const start = filters && filters.start ? filters.start : 0;

  React.useEffect(() => {
    setData({
      loading: true,
      error: null,
      data: null,
    });

    const esQueryParams: ESQueryParams = {
      pagination,
      q: searchText,
      filter: filters,
    };
    if (key === 'ls') {
      fetch(
        `http://localhost:8000/litsearch?search=${searchText}&model=USE&start=${pagination.from}&size=${pagination.size}`
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          setData({
            data,
            error: null,
            loading: false,
          });
        })
        .catch(error => {
          setData({
            error,
            loading: false,
            data: null,
          });
        });
    } else {
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
    }
  }, [key, searchText, filters, pagination]);

  return !!children
    ? children({
        loading,
        error,
        data,
      })
    : null;
};

export default SearchQueryContainer;
